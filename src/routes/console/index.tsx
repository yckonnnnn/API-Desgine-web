import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CheckCircle2, Coins, Hash } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getBilling, getDashboard, getUsage } from "@/lib/fyt";
import { formatNumber, formatTokens, formatYuan, maskKey } from "@/lib/format";

export const Route = createFileRoute("/console/")({ component: Overview });

function Overview() {
  const user = useCurrentUser();
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [usage, setUsage] = useState<Awaited<ReturnType<typeof getUsage>> | null>(null);
  const [activity, setActivity] = useState<Awaited<ReturnType<typeof getBilling>>>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    void getDashboard()
      .then(setData)
      .catch(() => setFailed(true));
    void getUsage()
      .then(setUsage)
      .catch(() => undefined);
    void getBilling()
      .then((rows) => setActivity(rows.slice(0, 6)))
      .catch(() => undefined);
  }, []);

  const name = user?.displayName?.split(" ")[0] ?? "there";

  const chart =
    usage?.days.map((d) => ({
      day: d.day.slice(5),
      tokens: d.input_tokens + d.output_tokens,
    })) ?? [];

  return (
    <section className="console-page">
      <header className="console-page-head">
        <p className="console-kicker">Console</p>
        <h1 className="console-hello">Welcome back, {name}.</h1>
      </header>

      {failed ? (
        <p className="console-muted">Unable to load workspace.</p>
      ) : !data ? (
        <p className="console-muted">Loading workspace…</p>
      ) : (
        <div className="console-stack">
          {/* The one dark surface in the workspace: the number you came to check. */}
          <div className="console-hero-panel">
            <div>
              <p className="console-hero-label">Balance</p>
              <p className="console-hero-value">{formatYuan(data.balanceCents)}</p>
              <p className="console-hero-meta">
                {formatYuan(data.todaySpendCents)} spent today across{" "}
                {formatNumber(data.requests)} requests
              </p>
            </div>
            <div className="console-hero-actions">
              <Link to="/console/wallet" className="btn-ink" data-cursor="hover">
                Add funds
              </Link>
              <Link to="/console/keys" className="btn-ghost" data-cursor="hover">
                New API key
              </Link>
            </div>
          </div>

          <dl className="console-metrics">
            <div className="console-metric">
              <dt>
                <Coins size={13} strokeWidth={2} aria-hidden="true" />
                Today spend
              </dt>
              <dd>{formatYuan(data.todaySpendCents)}</dd>
            </div>
            <div className="console-metric">
              <dt>
                <Hash size={13} strokeWidth={2} aria-hidden="true" />
                Requests
              </dt>
              <dd>{formatNumber(data.requests)}</dd>
            </div>
            <div className="console-metric">
              <dt>
                <Activity size={13} strokeWidth={2} aria-hidden="true" />
                Tokens
              </dt>
              <dd>{formatTokens(data.tokens)}</dd>
            </div>
            <div className="console-metric">
              <dt>
                <CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" />
                Success
              </dt>
              <dd>{(data.successBps / 100).toFixed(2)}%</dd>
            </div>
          </dl>

          {chart.length ? (
            <div className="console-panel">
              <div className="console-panel-head">
                <div>
                  <h2 className="console-panel-title">Token usage</h2>
                  <p className="console-panel-sub">
                    Last {chart.length} days, input and output combined
                  </p>
                </div>
                <Link to="/console/usage" className="console-link-inline" data-cursor="hover">
                  View detail
                </Link>
              </div>
              <div className="console-panel-body">
                <div className="usage-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chart}>
                      <defs>
                        <linearGradient id="fyt-usage-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A9DDE0" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="#A9DDE0" stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#92969D", fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={{ stroke: "rgba(17,18,20,0.14)" }}
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.[0]) return null;
                          return (
                            <div className="chart-tip glass">
                              <span>{label}</span>
                              <strong>{formatTokens(Number(payload[0].value))}</strong>
                            </div>
                          );
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="tokens"
                        stroke="#6E9EA2"
                        strokeWidth={1.5}
                        fill="url(#fyt-usage-fill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : null}

          {activity.length ? (
            <div className="console-panel">
              <div className="console-panel-head">
                <div>
                  <h2 className="console-panel-title">Recent requests</h2>
                  <p className="console-panel-sub">Latest charges on this workspace</p>
                </div>
                <Link to="/console/billing" className="console-link-inline" data-cursor="hover">
                  Full ledger
                </Link>
              </div>
              <div className="table-scroll">
                <table className="quiet-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Model</th>
                      <th>Key</th>
                      <th>Tokens</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((row) => (
                      <tr key={row.id}>
                        <td className="console-dim">{new Date(row.created_at).toLocaleString()}</td>
                        <td>{row.model}</td>
                        <td className="mono">{maskKey(row.api_key_last4)}</td>
                        <td className="console-num">
                          {formatNumber(row.input_tokens + row.output_tokens)}
                        </td>
                        <td className="console-num">{formatYuan(row.cost_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
