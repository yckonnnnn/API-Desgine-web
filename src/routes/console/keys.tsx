import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LiquidGlass } from "@/components/glass/liquid-glass";
import { createKey, disableKey, listKeys, renameKey } from "@/lib/fyt";
import { maskKey } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/keys")({ component: KeysPage });

type KeyRow = Awaited<ReturnType<typeof listKeys>>[number];

function KeysPage() {
  const [rows, setRows] = useState<KeyRow[] | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Production");
  const [fresh, setFresh] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const next = await listKeys();
    setRows(next);
  }

  useEffect(() => {
    void refresh().catch(() => setRows([]));
  }, []);

  function markCopied(id: string) {
    setCopied(id);
    window.setTimeout(() => setCopied((cur) => (cur === id ? null : cur)), 1600);
  }

  return (
    <section className="console-page">
      <header className="console-page-head">
        <p className="console-kicker">Access</p>
        <h1 className="console-title">API Keys</h1>
      </header>

      <div className="console-panel">
        <div className="console-panel-head">
          <div>
            <h2 className="console-panel-title">Keys</h2>
            <p className="console-panel-sub">
              {rows == null
                ? "Loading…"
                : `${rows.length} key${rows.length === 1 ? "" : "s"} on this workspace`}
            </p>
          </div>
          <button type="button" className="btn-ink" onClick={() => setOpen(true)} data-cursor="hover">
            Create API Key
          </button>
        </div>

        {rows == null ? (
          <div className="console-panel-body">
            <p className="console-muted">Loading keys…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="console-panel-body">
            <p className="console-muted">No keys yet. Create one to start routing.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="quiet-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {editing === row.id ? (
                        <input
                          className="glass-input table-input"
                          defaultValue={row.name}
                          autoFocus
                          onBlur={(e) => {
                            void renameKey({ data: { id: row.id, name: e.target.value } }).then(refresh);
                            setEditing(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          }}
                        />
                      ) : (
                        row.name
                      )}
                    </td>
                    <td className="mono">{maskKey(row.last4)}</td>
                    <td className="console-dim">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={cn("console-pill", row.disabled ? "is-off" : "is-ok")}>
                        <i aria-hidden="true" />
                        {row.disabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="row-actions">
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => {
                          void navigator.clipboard.writeText(maskKey(row.last4));
                          markCopied(row.id);
                        }}
                      >
                        {copied === row.id ? "Copied" : "Copy"}
                      </button>
                      <button type="button" data-cursor="hover" onClick={() => setEditing(row.id)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => void disableKey({ data: row.id }).then(refresh)}
                      >
                        {row.disabled ? "Enable" : "Disable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open ? (
        <div className="modal-layer">
          <LiquidGlass className="key-modal" interactive={false}>
            {fresh ? (
              <>
                <p className="console-kicker">Key created</p>
                <p className="fresh-key mono">{fresh}</p>
                <p className="console-muted">Copy it now. It will not be shown again.</p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      void navigator.clipboard.writeText(fresh);
                      markCopied("fresh");
                    }}
                  >
                    {copied === "fresh" ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    className="btn-ink"
                    onClick={() => {
                      setOpen(false);
                      setFresh(null);
                      setError(null);
                    }}
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="console-kicker">New key</p>
                <h2 className="console-title">Create API Key</h2>
                <label>
                  Name
                  <input
                    className="glass-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                {error ? <p className="auth-error">{error}</p> : null}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      setOpen(false);
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-ink"
                    onClick={() => {
                      setError(null);
                      void createKey({ data: name })
                        .then((res) => {
                          setFresh(res.secret);
                          void refresh();
                        })
                        .catch((err) => {
                          setError(err instanceof Error ? err.message : "Unable to create key");
                        });
                    }}
                  >
                    Generate
                  </button>
                </div>
              </>
            )}
          </LiquidGlass>
        </div>
      ) : null}
    </section>
  );
}
