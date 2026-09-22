import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { createKey, disableKey, listKeys, renameKey } from "@/lib/fyt";
import { maskKey } from "@/lib/format";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/keys")({ component: KeysPage });

type KeyRow = Awaited<ReturnType<typeof listKeys>>[number];

const rise = (i: number) => ({ "--ops-i": i }) as CSSProperties;

/** How long the modal's exit animation runs before unmount (keep in sync with CSS). */
const MODAL_EXIT_MS = 190;

function KeysPage() {
  const { language } = useLanguage();
  const zh = language === "zh";

  const [rows, setRows] = useState<KeyRow[] | null>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
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

  // Escape closes the dialog — but never while the fresh secret is on screen;
  // discarding it by reflex would lose the key forever.
  useEffect(() => {
    if (!open || fresh) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fresh, closing]);

  function markCopied(id: string) {
    setCopied(id);
    window.setTimeout(() => setCopied((cur) => (cur === id ? null : cur)), 1600);
  }

  function requestClose() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setFresh(null);
      setError(null);
    }, MODAL_EXIT_MS);
  }

  function toggleKey(row: KeyRow) {
    void disableKey({ data: row.id })
      .then(() => {
        toast.success(
          row.disabled
            ? zh
              ? "密钥已启用"
              : "Key enabled"
            : zh
              ? "密钥已停用"
              : "Key disabled",
          { description: row.name },
        );
      })
      .then(refresh)
      .catch(() => {
        toast.error(zh ? "操作失败，请稍后再试。" : "Something went wrong. Try again.");
      });
  }

  return (
    <section className="ops-page">
      <header className="ops-head ops-rise" style={rise(0)}>
        <div>
          <p className="ops-kicker">{zh ? "访问控制" : "Access"}</p>
          <h1 className="ops-title">{zh ? "API 密钥" : "API Keys"}</h1>
        </div>
      </header>

      <div className="ops-panel ops-rise" style={rise(1)}>
        <div className="ops-panel-head">
          <div>
            <h2 className="ops-panel-title">{zh ? "密钥列表" : "Keys"}</h2>
            <p className="ops-panel-sub">
              {rows == null
                ? zh
                  ? "加载中…"
                  : "Loading…"
                : zh
                  ? `本工作台共有 ${rows.length} 个密钥`
                  : `${rows.length} key${rows.length === 1 ? "" : "s"} on this workspace`}
            </p>
          </div>
          <button
            type="button"
            className="btn-ink"
            data-cursor="hover"
            onClick={() => {
              setName("Production");
              setOpen(true);
            }}
          >
            {zh ? "创建密钥" : "Create API Key"}
          </button>
        </div>

        {rows == null ? (
          <div className="ops-panel-body">
            <div style={{ display: "grid", gap: 10 }} aria-hidden="true">
              <div className="ops-skel" style={{ height: 38 }} />
              <div className="ops-skel" style={{ height: 38 }} />
              <div className="ops-skel" style={{ height: 38, width: "72%" }} />
            </div>
          </div>
        ) : rows.length === 0 ? (
          <p className="ops-empty">
            {zh ? "还没有密钥。创建一个即可开始接入。" : "No keys yet. Create one to start routing."}
          </p>
        ) : (
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>{zh ? "名称" : "Name"}</th>
                  <th>{zh ? "密钥" : "Key"}</th>
                  <th>{zh ? "创建时间" : "Created"}</th>
                  <th>{zh ? "状态" : "Status"}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {editing === row.id ? (
                        <input
                          className="ops-input ops-input-table"
                          defaultValue={row.name}
                          autoFocus
                          aria-label={zh ? "密钥名称" : "Key name"}
                          onBlur={(e) => {
                            void renameKey({ data: { id: row.id, name: e.target.value } })
                              .then(refresh)
                              .catch(() => undefined);
                            setEditing(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            if (e.key === "Escape") setEditing(null);
                          }}
                        />
                      ) : (
                        row.name
                      )}
                    </td>
                    <td className="mono">{maskKey(row.last4)}</td>
                    <td className="ops-dim">
                      {new Date(row.created_at).toLocaleDateString(zh ? "zh-CN" : "en-US")}
                    </td>
                    <td>
                      <span className={cn("ops-pill", row.disabled ? "is-off" : "is-ok")}>
                        <i aria-hidden="true" />
                        {row.disabled ? (zh ? "已停用" : "Disabled") : zh ? "启用中" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="ops-row-actions">
                        <button
                          type="button"
                          className="ops-rowbtn"
                          data-cursor="hover"
                          onClick={() => {
                            void navigator.clipboard.writeText(maskKey(row.last4));
                            markCopied(row.id);
                          }}
                        >
                          {copied === row.id ? (zh ? "已复制" : "Copied") : zh ? "复制" : "Copy"}
                        </button>
                        <button
                          type="button"
                          className="ops-rowbtn"
                          data-cursor="hover"
                          onClick={() => setEditing(row.id)}
                        >
                          {zh ? "重命名" : "Rename"}
                        </button>
                        <button
                          type="button"
                          className={cn("ops-rowbtn", !row.disabled && "is-danger")}
                          data-cursor="hover"
                          onClick={() => toggleKey(row)}
                        >
                          {row.disabled ? (zh ? "启用" : "Enable") : zh ? "停用" : "Disable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open ? (
        <div
          className={cn("ops-modal-layer", closing && "is-closing")}
          onClick={fresh ? undefined : requestClose}
        >
          <div
            className="ops-modal"
            role="dialog"
            aria-modal="true"
            aria-label={fresh ? (zh ? "密钥已创建" : "Key created") : zh ? "创建密钥" : "Create API key"}
            onClick={(e) => e.stopPropagation()}
          >
            {fresh ? (
              <>
                <p className="ops-kicker">{zh ? "创建成功" : "Key created"}</p>
                <p className="ops-fresh">{fresh}</p>
                <p className="ops-modal-note">
                  {zh
                    ? "请立即复制保存——这串密钥之后不会再显示。"
                    : "Copy it now. It will not be shown again."}
                </p>
                <div className="ops-modal-actions">
                  <button
                    type="button"
                    className="btn-ghost"
                    autoFocus
                    data-cursor="hover"
                    onClick={() => {
                      void navigator.clipboard.writeText(fresh);
                      markCopied("fresh");
                    }}
                  >
                    {copied === "fresh" ? (zh ? "已复制" : "Copied") : zh ? "复制" : "Copy"}
                  </button>
                  <button type="button" className="btn-ink" data-cursor="hover" onClick={requestClose}>
                    {zh ? "完成" : "Done"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="ops-kicker">{zh ? "新建密钥" : "New key"}</p>
                <h2 className="ops-panel-title" style={{ fontSize: 18, margin: "2px 0 4px" }}>
                  {zh ? "创建 API 密钥" : "Create API key"}
                </h2>
                <label className="ops-field">
                  {zh ? "名称" : "Name"}
                  <input
                    className="ops-input"
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                {error ? <p className="ops-error">{error}</p> : null}
                <div className="ops-modal-actions">
                  <button type="button" className="btn-ghost" data-cursor="hover" onClick={requestClose}>
                    {zh ? "取消" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    className="btn-ink"
                    data-cursor="hover"
                    onClick={() => {
                      setError(null);
                      void createKey({ data: name })
                        .then((res) => {
                          setFresh(res.secret);
                          void refresh();
                          toast.success(zh ? "密钥已创建" : "API key created", {
                            description: zh ? "请立即复制，稍后不再显示。" : "Copy it now — it won't be shown again.",
                          });
                        })
                        .catch((err) => {
                          setError(
                            err instanceof Error
                              ? err.message
                              : zh
                                ? "创建失败，请稍后再试。"
                                : "Unable to create key",
                          );
                        });
                    }}
                  >
                    {zh ? "生成" : "Generate"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
