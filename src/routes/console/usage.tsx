import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Coins, Layers3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getUsage } from "@/lib/fyt";
import { formatNumber, formatTokens, formatUsd } from "@/lib/format";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/usage")({ component: UsagePage });

const rise = (i: number) => ({ "--ops-i": i }) as CSSProperties;
type Mode = "tokens" | "mix" | "cost";
const MODES: Mode[] = ["tokens", "mix", "cost"];

function UsagePage() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const [data, setData] = useState<Awaited<ReturnType<typeof getUsage>> | null>(null);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<Mode>("tokens");

  useEffect(() => {
    void getUsage()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const chart = data?.days.map((day) => ({
    day: day.day.slice(5),
    input: day.input_tokens,
    output: day.output_tokens,
    inputShare: day.input_tokens + day.output_tokens ? Math.round((day.input_tokens / (day.input_tokens + day.output_tokens)) * 100) : 0,
    outputShare: day.input_tokens + day.output_tokens ? 100 - Math.round((day.input_tokens / (day.input_tokens + day.output_tokens)) * 100) : 0,
    cost: day.cost_cents,
  })) ?? [];
  const inputShare = data?.total ? Math.round((data.input / data.total) * 100) : 0;
  const outputShare = 100 - inputShare;
  const modeLabel: Record<Mode, string> = zh
    ? { tokens: "Token 趋势", mix: "输入 / 输出占比", cost: "费用趋势" }
    : { tokens: "Token trend", mix: "Input / output mix", cost: "Cost trend" };

  return (
    <section className="ops-page usage-page">
      <header className="ops-head usage-head ops-rise" style={rise(0)}>
        <div>
          <p className="ops-kicker">{zh ? "用量分析" : "Usage analytics"}</p>
          <h1 className="ops-title">{zh ? "Token 用量" : "Token usage"}</h1>
          <p className="ops-head-sub">{zh ? "查看 Token 消耗、费用变化与每日记录。" : "Review token consumption, cost, and daily activity."}</p>
        </div>
        {data && chart.length > 0 ? (
          <span className="usage-period">{zh ? "最近 " + chart.length + " 天" : "Last " + chart.length + " days"}</span>
        ) : null}
      </header>

      {failed ? (
        <div className="ops-panel ops-rise" style={rise(1)}>
          <p className="ops-empty">{zh ? "用量加载失败，请稍后再试。" : "Unable to load usage."}</p>
        </div>
      ) : !data ? (
        <>
        <div className="usage-overview" aria-hidden="true">
          {Array.from({ length: 4 }, (_, index) => <div className="usage-stat-skeleton ops-skel" key={index} />)}
        </div>
        <div className="usage-loading-chart ops-skel" aria-hidden="true" />
        </>
      ) : (
        <div className="usage-content">
          <section className="usage-overview ops-rise" style={rise(1)} aria-label={zh ? "用量概览" : "Usage overview"}>
            <article className="usage-stat">
              <span><Layers3 size={16} aria-hidden="true" />{zh ? "总 Token" : "Total tokens"}</span>
              <strong>{formatTokens(data.total)}</strong>
              <small>{zh ? "输入与输出合计" : "Input and output combined"}</small>
            </article>
            <article className="usage-stat">
              <span><ArrowDownRight size={16} aria-hidden="true" />{zh ? "输入" : "Input"}</span>
              <strong>{formatTokens(data.input)}</strong>
              <small>{inputShare}{zh ? "% 的总量" : "% of total"}</small>
            </article>
            <article className="usage-stat">
              <span><ArrowUpRight size={16} aria-hidden="true" />{zh ? "输出" : "Output"}</span>
              <strong>{formatTokens(data.output)}</strong>
              <small>{outputShare}{zh ? "% 的总量" : "% of total"}</small>
            </article>
            <article className="usage-stat usage-stat-cost">
              <span><Coins size={16} aria-hidden="true" />{zh ? "累计费用" : "Total cost"}</span>
              <strong>{formatUsd(data.cost)}</strong>
              <small>{zh ? "按当前记录汇总" : "Sum of recorded usage"}</small>
            </article>
          </section>

          <section className="usage-trend-card ops-rise" style={rise(2)}>
              <div className="usage-trend-head">
                <div>
                  <p className="usage-section-label">{zh ? "调用趋势" : "REQUEST TREND"}</p>
                  <h2>{mode === "cost" ? (zh ? "每日费用" : "Daily cost") : mode === "mix" ? (zh ? "输入与输出占比" : "Input and output mix") : (zh ? "每日 Token 消耗" : "Daily token usage")}</h2>
                </div>
                <div className="usage-mode-switch" role="group" aria-label={zh ? "分析视图" : "Analysis view"}>
                  {MODES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={cn(mode === item && "is-on")}
                      aria-pressed={mode === item}
                      onClick={() => setMode(item)}
                    >
                      {modeLabel[item]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="usage-trend-summary">
                <div>
                  <span>{mode === "cost" ? (zh ? "累计费用" : "Total cost") : mode === "mix" ? (zh ? "输入占比" : "Input share") : (zh ? "这段时间共使用" : "Tokens in this period")}</span>
                  <strong>{mode === "cost" ? formatUsd(data.cost) : mode === "mix" ? inputShare + "%" : formatTokens(data.total)}</strong>
                </div>
                <p>{mode === "mix" ? (zh ? "按每天的 Token 总量计算比例。" : "Share of each day’s token total.") : mode === "cost" ? (zh ? "费用按每日用量记录汇总。" : "Daily cost summed from usage records.") : (zh ? "每天一组数据，可比较输入与输出。" : "Compare input and output across days.")}</p>
              </div>

              <div className="usage-bars">
                {chart.length === 0 ? (
                  <p className="usage-chart-empty">{zh ? "当前还没有用量记录" : "No usage recorded yet"}</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart} barCategoryGap="30%" margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="var(--usage-grid)" strokeDasharray="3 6" />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--usage-muted)", fontSize: 11 }}
                        minTickGap={16}
                      />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: "var(--usage-bar-hover)" }}
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          const inputKey = mode === "mix" ? "inputShare" : "input";
                          const outputKey = mode === "mix" ? "outputShare" : "output";
                          const input = Number(payload.find((item) => item.dataKey === inputKey)?.value ?? 0);
                          const output = Number(payload.find((item) => item.dataKey === outputKey)?.value ?? 0);
                          return (
                            <div className="usage-chart-tip">
                              <span>{label}</span>
                                  {mode === "cost" ? <p>{zh ? "费用" : "Cost"} <strong>{formatUsd(Number(payload[0]?.value ?? 0))}</strong></p> : <>
                                    <p>{zh ? "输入" : "Input"} <strong>{mode === "mix" ? input + "%" : formatNumber(input)}</strong></p>
                                    <p>{zh ? "输出" : "Output"} <strong>{mode === "mix" ? output + "%" : formatNumber(output)}</strong></p>
                                    {mode === "tokens" ? <p className="is-total">{zh ? "合计" : "Total"} <strong>{formatNumber(input + output)}</strong></p> : null}
                                  </>}
                            </div>
                          );
                        }}
                      />
                      {mode === "cost" && <Bar dataKey="cost" fill="var(--usage-bar-input)" maxBarSize={30} radius={[4, 4, 0, 0]} isAnimationActive={false} />}
                      {mode !== "cost" && <Bar dataKey={mode === "mix" ? "inputShare" : "input"} stackId="tokens" fill="var(--usage-bar-input)" maxBarSize={30} isAnimationActive={false} />}
                      {mode !== "cost" && <Bar dataKey={mode === "mix" ? "outputShare" : "output"} stackId="tokens" fill="var(--usage-bar-output)" maxBarSize={30} radius={[4, 4, 0, 0]} isAnimationActive={false} />}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="usage-trend-footer">
                {mode === "cost" ? <span><i className="is-input" />{zh ? "费用" : "Cost"}</span> : <>
                  <span><i className="is-input" />{mode === "mix" ? (zh ? "输入占比" : "Input share") : (zh ? "输入 Token" : "Input tokens")}</span>
                  <span><i className="is-output" />{mode === "mix" ? (zh ? "输出占比" : "Output share") : (zh ? "输出 Token" : "Output tokens")}</span>
                </>}
                <span className="usage-trend-period">{zh ? "近 " + chart.length + " 天" : chart.length + " days"}</span>
              </div>
          </section>

          <section className="usage-detail ops-rise" style={rise(3)}>
            <div className="usage-detail-head">
              <div>
                <p className="usage-section-label">{zh ? "明细记录" : "DAILY RECORD"}</p>
                <h2>{zh ? "按日明细" : "Daily breakdown"}</h2>
              </div>
              <span>{zh ? "新日期在前" : "Newest first"}</span>
            </div>
            {data.days.length === 0 ? (
              <p className="ops-empty">{zh ? "当前还没有用量记录。" : "No usage recorded yet."}</p>
            ) : (
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
                        <td className="is-num">{formatUsd(day.cost_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
