import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getUsage } from "@/lib/fyt";
import { formatTokens, formatYuan } from "@/lib/format";

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
      <p className="console-kicker">Telemetry</p>
      <h1 className="console-title">Token usage</h1>
      {failed ? (
        <p className="console-muted">Unable to load usage.</p>
      ) : data ? (
        <>
          <dl className="console-stats">
            <div>
              <dt>Total</dt>
              <dd>{formatTokens(data.total)}</dd>
            </div>
            <div>
              <dt>Input</dt>
              <dd>{formatTokens(data.input)}</dd>
            </div>
            <div>
              <dt>Output</dt>
              <dd>{formatTokens(data.output)}</dd>
            </div>
            <div>
              <dt>Cost</dt>
              <dd>{formatYuan(data.cost)}</dd>
            </div>
          </dl>
          <div className="usage-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#92969D", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
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
                <Line
                  type="monotone"
                  dataKey="tokens"
                  stroke={active == null ? "#111214" : "#A9DDE0"}
                  strokeWidth={1.25}
                  dot={false}
                  activeDot={{ r: 3, fill: "#A9DDE0", stroke: "none" }}
                  onMouseMove={() => setActive(1)}
                  onMouseLeave={() => setActive(null)}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="console-muted">Loading usage…</p>
      )}
    </section>
  );
}
