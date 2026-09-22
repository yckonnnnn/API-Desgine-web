import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Coins, Hash, ReceiptText, Scale } from "lucide-react";
import { getBilling } from "@/lib/fyt";
import { formatNumber, formatYuan, maskKey } from "@/lib/format";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/billing")({ component: BillingPage });

const rise = (i: number) => ({ "--ops-i": i }) as CSSProperties;

function BillingPage() {
  const { language } = useLanguage();
  const zh = language === "zh";

  const [rows, setRows] = useState<Awaited<ReturnType<typeof getBilling>> | null>(null);

  useEffect(() => {
    void getBilling()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  const total = rows?.reduce((sum, row) => sum + row.cost_cents, 0) ?? 0;
  const tokens = rows?.reduce((sum, row) => sum + row.input_tokens + row.output_tokens, 0) ?? 0;
  const locale = zh ? "zh-CN" : "en-US";

  return (
    <section className="ops-page">
      <header className="ops-head ops-rise" style={rise(0)}>
        <div>
          <p className="ops-kicker">{zh ? "账务" : "Ledger"}</p>
          <h1 className="ops-title">{zh ? "账单" : "Billing"}</h1>
        </div>
      </header>

      {rows == null ? (
        <div className="ops-stack" aria-hidden="true">
          <div className="ops-metrics">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="ops-metric ops-rise" style={rise(1 + i)}>
                <div className="ops-skel" style={{ width: 84, height: 11 }} />
                <div className="ops-skel" style={{ width: 124, height: 26, marginTop: 15 }} />
              </div>
            ))}
          </div>
          <div className="ops-panel ops-rise" style={rise(5)}>
            <div className="ops-panel-body">
              <div className="ops-skel" style={{ height: 38 }} />
              <div className="ops-skel" style={{ height: 38, marginTop: 10 }} />
              <div className="ops-skel" style={{ height: 38, marginTop: 10, width: "78%" }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="ops-stack">
          <dl className="ops-metrics">
            <div className="ops-metric ops-rise" style={rise(1)}>
              <dt>
                <ReceiptText size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "记录数" : "Entries"}
              </dt>
              <dd>{formatNumber(rows.length)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(2)}>
              <dt>
                <Coins size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "累计消费" : "Total charged"}
              </dt>
              <dd>{formatYuan(total)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(3)}>
              <dt>
                <Hash size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "计费 Token" : "Tokens billed"}
              </dt>
              <dd>{formatNumber(tokens)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(4)}>
              <dt>
                <Scale size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "单次均价" : "Average per call"}
              </dt>
              <dd>{rows.length ? formatYuan(Math.round(total / rows.length)) : "—"}</dd>
            </div>
          </dl>

          <div className="ops-panel ops-rise" style={rise(5)}>
            <div className="ops-panel-head">
              <div>
                <h2 className="ops-panel-title">{zh ? "扣费明细" : "Charges"}</h2>
                <p className="ops-panel-sub">
                  {zh ? "最新在前 · 从钱包余额中扣除" : "Newest first, drawn from wallet balance"}
                </p>
              </div>
            </div>
            {rows.length === 0 ? (
              <p className="ops-empty">{zh ? "还没有扣费记录。" : "No charges yet."}</p>
            ) : (
              <div className="ops-table-wrap">
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th>{zh ? "时间" : "Time"}</th>
                      <th>{zh ? "模型" : "Model"}</th>
                      <th>{zh ? "API 密钥" : "API key"}</th>
                      <th className="is-num">{zh ? "输入" : "Input"}</th>
                      <th className="is-num">{zh ? "输出" : "Output"}</th>
                      <th className="is-num">{zh ? "费用" : "Cost"}</th>
                      <th>{zh ? "状态" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="ops-dim">{new Date(row.created_at).toLocaleString(locale)}</td>
                        <td>{row.model}</td>
                        <td className="mono">{maskKey(row.api_key_last4)}</td>
                        <td className="is-num">{formatNumber(row.input_tokens)}</td>
                        <td className="is-num">{formatNumber(row.output_tokens)}</td>
                        <td className="is-num">{formatYuan(row.cost_cents)}</td>
                        <td>
                          <span className={cn("ops-pill", row.status === "ok" ? "is-ok" : "is-off")}>
                            <i aria-hidden="true" />
                            {row.status === "ok" ? (zh ? "成功" : "OK") : row.status}
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
