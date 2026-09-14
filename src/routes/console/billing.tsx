import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getBilling } from "@/lib/fyt";
import { formatNumber, formatYuan, maskKey } from "@/lib/format";

export const Route = createFileRoute("/console/billing")({ component: BillingPage });

function BillingPage() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getBilling>> | null>(null);

  useEffect(() => {
    void getBilling()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  return (
    <section className="console-page">
      <p className="console-kicker">Ledger</p>
      <h1 className="console-title">Billing</h1>
      {rows == null ? (
        <p className="console-muted">Loading ledger…</p>
      ) : rows.length === 0 ? (
        <p className="console-muted">No charges yet.</p>
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
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                  <td>{row.model}</td>
                  <td className="mono">{maskKey(row.api_key_last4)}</td>
                  <td>{formatNumber(row.input_tokens)}</td>
                  <td>{formatNumber(row.output_tokens)}</td>
                  <td>{formatYuan(row.cost_cents)}</td>
                  <td>{row.status === "ok" ? "OK" : row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
