import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getBilling } from "@/lib/fyt";
import { formatNumber, formatYuan, maskKey } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/billing")({ component: BillingPage });

function BillingPage() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getBilling>> | null>(null);

  useEffect(() => {
    void getBilling()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  const total = rows?.reduce((sum, row) => sum + row.cost_cents, 0) ?? 0;
  const tokens = rows?.reduce((sum, row) => sum + row.input_tokens + row.output_tokens, 0) ?? 0;

  return (
    <section className="console-page">
      <header className="console-page-head">
        <p className="console-kicker">Ledger</p>
        <h1 className="console-title">Billing</h1>
      </header>

      {rows == null ? (
        <p className="console-muted">Loading ledger…</p>
      ) : (
        <div className="console-stack">
          <dl className="console-metrics">
            <div className="console-metric">
              <dt>Entries</dt>
              <dd>{formatNumber(rows.length)}</dd>
            </div>
            <div className="console-metric">
              <dt>Total charged</dt>
              <dd>{formatYuan(total)}</dd>
            </div>
            <div className="console-metric">
              <dt>Tokens billed</dt>
              <dd>{formatNumber(tokens)}</dd>
            </div>
            <div className="console-metric">
              <dt>Average per call</dt>
              <dd>{rows.length ? formatYuan(Math.round(total / rows.length)) : "—"}</dd>
            </div>
          </dl>

          <div className="console-panel">
            <div className="console-panel-head">
              <div>
                <h2 className="console-panel-title">Charges</h2>
                <p className="console-panel-sub">Newest first, drawn from wallet balance</p>
              </div>
            </div>
            {rows.length === 0 ? (
              <div className="console-panel-body">
                <p className="console-muted">No charges yet.</p>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="quiet-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Model</th>
                      <th>API Key</th>
                      <th>Input</th>
                      <th>Output</th>
                      <th>Cost</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="console-dim">{new Date(row.created_at).toLocaleString()}</td>
                        <td>{row.model}</td>
                        <td className="mono">{maskKey(row.api_key_last4)}</td>
                        <td className="console-num">{formatNumber(row.input_tokens)}</td>
                        <td className="console-num">{formatNumber(row.output_tokens)}</td>
                        <td className="console-num">{formatYuan(row.cost_cents)}</td>
                        <td>
                          <span className={cn("console-pill", row.status === "ok" ? "is-ok" : "is-off")}>
                            <i aria-hidden="true" />
                            {row.status === "ok" ? "OK" : row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
