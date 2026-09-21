import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getUsage } from "@/lib/fyt";
import { formatNumber, formatTokens, formatYuan } from "@/lib/format";

export const Route = createFileRoute("/console/usage")({ component: UsagePage });

function UsagePage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getUsage>> | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    void getUsage()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const chart =
    data?.days.map((d) => ({
      day: d.day.slice(5),
      tokens: d.input_tokens + d.output_tokens,
    })) ?? [];

  return (
    <section className="console-page">
      <header className="console-page-head">
        <p className="console-kicker">Telemetry</p>
        <h1 className="console-title">Token usage</h1>
      </header>

      {failed ? (
        <p className="console-muted">Unable to load usage.</p>
      ) : data ? (
        <div className="console-stack">
          <dl className="console-metrics">
            <div className="console-metric">
              <dt>Total</dt>
              <dd>{formatTokens(data.total)}</dd>
            </div>
            <div className="console-metric">
              <dt>Input</dt>
              <dd>{formatTokens(data.input)}</dd>
            </div>
            <div className="console-metric">
              <dt>Output</dt>
              <dd>{formatTokens(data.output)}</dd>
            </div>
            <div className="console-metric">
              <dt>Cost</dt>
              <dd>{formatYuan(data.cost)}</dd>
            </div>
          </dl>

          <div className="console-panel">
            <div className="console-panel-head">
              <div>
                <h2 className="console-panel-title">Daily tokens</h2>
                <p className="console-panel-sub">Input and output combined, last {chart.length} days</p>
              </div>
            </div>
            <div className="console-panel-body">
              <div className="usage-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id="fyt-usage-detail" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A9DDE0" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#A9DDE0" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#92969D", fontSize: 11 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ stroke: "rgba(17,18,20,0.14)" }}
                      content={({ active: tipOn, payload, label }) => {
                        if (!tipOn || !payload?.[0]) return null;
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
                      stroke={active == null ? "#111214" : "#6E9EA2"}
                      strokeWidth={1.4}
                      fill="url(#fyt-usage-detail)"
                      dot={false}
                      activeDot={{ r: 3, fill: "#A9DDE0", stroke: "none" }}
                      onMouseMove={() => setActive(1)}
                      onMouseLeave={() => setActive(null)}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="console-panel">
            <div className="console-panel-head">
              <div>
                <h2 className="console-panel-title">By day</h2>
                <p className="console-panel-sub">Same window, as figures</p>
              </div>
            </div>
            <div className="table-scroll">
              <table className="quiet-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Input</th>
                    <th>Output</th>
                    <th>Tokens</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.days].reverse().map((day) => (
                    <tr key={day.day}>
                      <td className="console-dim">{day.day}</td>
                      <td className="console-num">{formatNumber(day.input_tokens)}</td>
                      <td className="console-num">{formatNumber(day.output_tokens)}</td>
                      <td className="console-num">
                        {formatNumber(day.input_tokens + day.output_tokens)}
                      </td>
                      <td className="console-num">{formatYuan(day.cost_cents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="console-muted">Loading usage…</p>
      )}
    </section>
  );
}
