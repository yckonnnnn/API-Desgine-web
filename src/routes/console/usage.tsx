import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Coins, Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getUsage } from "@/lib/fyt";
import { formatNumber, formatTokens, formatYuan } from "@/lib/format";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/usage")({ component: UsagePage });

const rise = (i: number) => ({ "--ops-i": i }) as CSSProperties;

type Mode = "total" | "input" | "output";

const MODES: Mode[] = ["total", "input", "output"];

/** Per-mode stroke/fill: input reads ice, output reads acid, total sits between. */
const MODE_COLOR: Record<Mode, { stroke: string; from: string; to: number }> = {
  total: { stroke: "#4E7A80", from: "#A9DDE0", to: 0.04 },
  input: { stroke: "#6E9EA2", from: "#A9DDE0", to: 0.03 },
  output: { stroke: "#5F7A16", from: "#CBF24F", to: 0.05 },
};

function UsagePage() {
  const { language } = useLanguage();
  const zh = language === "zh";

  const [data, setData] = useState<Awaited<ReturnType<typeof getUsage>> | null>(null);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<Mode>("total");

  useEffect(() => {
    void getUsage()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const chart =
    data?.days.map((d) => ({
      day: d.day.slice(5),
      total: d.input_tokens + d.output_tokens,
      input: d.input_tokens,
      output: d.output_tokens,
    })) ?? [];

  const color = MODE_COLOR[mode];
  const modeLabel: Record<Mode, string> = zh
    ? { total: "全部", input: "输入", output: "输出" }
    : { total: "Total", input: "Input", output: "Output" };
  const modeSub: Record<Mode, string> = zh
    ? {
        total: `输入与输出合并 · 近 ${chart.length} 天`,
        input: `每日输入 Token · 近 ${chart.length} 天`,
        output: `每日输出 Token · 近 ${chart.length} 天`,
      }
    : {
        total: `Input and output combined, last ${chart.length} days`,
        input: `Input tokens per day, last ${chart.length} days`,
        output: `Output tokens per day, last ${chart.length} days`,
      };

  return (
    <section className="ops-page">
      <header className="ops-head ops-rise" style={rise(0)}>
        <div>
          <p className="ops-kicker">{zh ? "用量遥测" : "Telemetry"}</p>
          <h1 className="ops-title">{zh ? "Token 用量" : "Token usage"}</h1>
        </div>
      </header>

      {failed ? (
        <div className="ops-panel ops-rise" style={rise(1)}>
          <p className="ops-empty">{zh ? "用量加载失败，请稍后再试。" : "Unable to load usage."}</p>
        </div>
      ) : !data ? (
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
              <div className="ops-skel" style={{ height: 240 }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="ops-stack">
          <dl className="ops-metrics">
            <div className="ops-metric ops-rise" style={rise(1)}>
              <dt>
                <Activity size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "总计" : "Total"}
              </dt>
              <dd>{formatTokens(data.total)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(2)}>
              <dt>
                <ArrowDownRight size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "输入" : "Input"}
              </dt>
              <dd>{formatTokens(data.input)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(3)}>
              <dt>
                <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "输出" : "Output"}
              </dt>
              <dd>{formatTokens(data.output)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(4)}>
              <dt>
                <Coins size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "消费" : "Cost"}
              </dt>
              <dd>{formatYuan(data.cost)}</dd>
            </div>
          </dl>

          <div className="ops-panel ops-rise" style={rise(5)}>
            <div className="ops-panel-head">
              <div>
                <h2 className="ops-panel-title">{zh ? "每日 Token" : "Daily tokens"}</h2>
                <p className="ops-panel-sub">{modeSub[mode]}</p>
              </div>
              <div
                className="ops-seg"
                role="radiogroup"
                aria-label={zh ? "数据系列" : "Series"}
                style={{ "--ops-seg-i": MODES.indexOf(mode), "--ops-seg-count": MODES.length } as CSSProperties}
              >
                <span className="ops-seg-thumb" aria-hidden="true" />
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mode === m}
                    className={cn(mode === m && "is-on")}
                    data-cursor="hover"
                    onClick={() => setMode(m)}
                  >
                    {modeLabel[m]}
                  </button>
                ))}
              </div>
            </div>
            <div className="ops-panel-body">
              <div className="ops-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id={`fyt-usage-${mode}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color.from} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={color.from} stopOpacity={color.to} />
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
                      cursor={{ stroke: "rgb(17 18 20 / 0.14)" }}
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
                      key={mode}
                      type="monotone"
                      dataKey={mode}
                      stroke={color.stroke}
                      strokeWidth={1.5}
                      fill={`url(#fyt-usage-${mode})`}
                      dot={false}
                      activeDot={{ r: 3, fill: color.from, stroke: "none" }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="ops-panel ops-rise" style={rise(6)}>
            <div className="ops-panel-head">
              <div>
                <h2 className="ops-panel-title">{zh ? "按日明细" : "By day"}</h2>
                <p className="ops-panel-sub">{zh ? "同一时间窗口的数字明细" : "Same window, as figures"}</p>
              </div>
            </div>
            <div className="ops-table-wrap">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>{zh ? "日期" : "Day"}</th>
                    <th className="is-num">{zh ? "输入" : "Input"}</th>
                    <th className="is-num">{zh ? "输出" : "Output"}</th>
                    <th className="is-num">{zh ? "Token" : "Tokens"}</th>
                    <th className="is-num">{zh ? "费用" : "Cost"}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.days].reverse().map((day) => (
                    <tr key={day.day}>
                      <td className="ops-dim">{day.day}</td>
                      <td className="is-num">{formatNumber(day.input_tokens)}</td>
                      <td className="is-num">{formatNumber(day.output_tokens)}</td>
                      <td className="is-num">{formatNumber(day.input_tokens + day.output_tokens)}</td>
                      <td className="is-num">{formatYuan(day.cost_cents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
