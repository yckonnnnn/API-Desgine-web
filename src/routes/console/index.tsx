import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CheckCircle2, Coins, Hash } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getBilling, getDashboard, getUsage } from "@/lib/fyt";
import { formatNumber, formatTokens, formatYuan, maskKey } from "@/lib/format";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/console/")({ component: Overview });

/** Stagger index for the page entrance — see `.ops-rise` in styles.css. */
const rise = (i: number) => ({ "--ops-i": i }) as CSSProperties;

function Overview() {
  const user = useCurrentUser();
  const { language } = useLanguage();
  const zh = language === "zh";

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

  const firstName = user?.displayName?.split(" ")[0];
  const title = zh
    ? firstName
      ? `欢迎回来，${firstName}。`
      : "欢迎回来。"
    : `Welcome back, ${firstName ?? "there"}.`;

  const chart =
    usage?.days.map((d) => ({
      day: d.day.slice(5),
      tokens: d.input_tokens + d.output_tokens,
    })) ?? [];

  const locale = zh ? "zh-CN" : "en-US";

  return (
    <section className="ops-page">
      <header className="ops-head ops-rise" style={rise(0)}>
        <div>
          <p className="ops-kicker">{zh ? "控制台" : "Console"}</p>
          <h1 className="ops-title">{title}</h1>
        </div>
      </header>

      {failed ? (
        <div className="ops-panel ops-rise" style={rise(1)}>
          <p className="ops-empty">{zh ? "工作台加载失败，请稍后再试。" : "Unable to load the workspace."}</p>
        </div>
      ) : !data ? (
        <div className="ops-stack" aria-hidden="true">
          <div className="ops-hero ops-rise" style={rise(1)}>
            <div>
              <div className="ops-skel" style={{ width: 76, height: 12 }} />
              <div className="ops-skel" style={{ width: 280, height: 44, marginTop: 20 }} />
              <div className="ops-skel" style={{ width: 230, height: 12, marginTop: 18 }} />
            </div>
          </div>
          <div className="ops-metrics">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="ops-metric ops-rise" style={rise(2 + i)}>
                <div className="ops-skel" style={{ width: 84, height: 11 }} />
                <div className="ops-skel" style={{ width: 124, height: 26, marginTop: 15 }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="ops-stack">
          {/* The one dark surface in the workspace: the number you came to check. */}
          <div className="ops-hero ops-rise" style={rise(1)}>
            <div>
              <p className="ops-hero-label">{zh ? "余额" : "Balance"}</p>
              <p className="ops-hero-value">{formatYuan(data.balanceCents)}</p>
              <p className="ops-hero-meta">
                {zh
                  ? `今日已消费 ${formatYuan(data.todaySpendCents)} · 共 ${formatNumber(data.requests)} 次请求`
                  : `${formatYuan(data.todaySpendCents)} spent today across ${formatNumber(data.requests)} requests`}
              </p>
            </div>
            <div className="ops-hero-actions">
              <Link to="/console/wallet" className="btn-ink" data-cursor="hover">
                {zh ? "充值" : "Add funds"}
              </Link>
              <Link to="/console/keys" className="btn-ghost" data-cursor="hover">
                {zh ? "新建密钥" : "New API key"}
              </Link>
            </div>
          </div>

          <dl className="ops-metrics">
            <div className="ops-metric ops-rise" style={rise(2)}>
              <dt>
                <Coins size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "今日消费" : "Today spend"}
              </dt>
              <dd>{formatYuan(data.todaySpendCents)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(3)}>
              <dt>
                <Hash size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "请求数" : "Requests"}
              </dt>
              <dd>{formatNumber(data.requests)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(4)}>
              <dt>
                <Activity size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "Token 数" : "Tokens"}
              </dt>
              <dd>{formatTokens(data.tokens)}</dd>
            </div>
            <div className="ops-metric ops-rise" style={rise(5)}>
              <dt>
                <CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" />
                {zh ? "成功率" : "Success"}
              </dt>
              <dd>{(data.successBps / 100).toFixed(2)}%</dd>
            </div>
          </dl>

          {chart.length ? (
            <div className="ops-panel ops-rise" style={rise(6)}>
              <div className="ops-panel-head">
                <div>
                  <h2 className="ops-panel-title">{zh ? "Token 用量" : "Token usage"}</h2>
                  <p className="ops-panel-sub">
                    {zh
                      ? `近 ${chart.length} 天 · 输入与输出合并`
                      : `Last ${chart.length} days, input and output combined`}
                  </p>
                </div>
                <Link to="/console/usage" className="ops-link-inline" data-cursor="hover">
                  {zh ? "查看详情" : "View detail"}
                </Link>
              </div>
              <div className="ops-panel-body">
                <div className="ops-chart">
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
                        cursor={{ stroke: "rgb(17 18 20 / 0.14)" }}
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
            <div className="ops-panel ops-rise" style={rise(7)}>
              <div className="ops-panel-head">
                <div>
                  <h2 className="ops-panel-title">{zh ? "最近请求" : "Recent requests"}</h2>
                  <p className="ops-panel-sub">
                    {zh ? "本工作台最新的扣费记录" : "Latest charges on this workspace"}
                  </p>
                </div>
                <Link to="/console/billing" className="ops-link-inline" data-cursor="hover">
                  {zh ? "完整账单" : "Full ledger"}
                </Link>
              </div>
              <div className="ops-table-wrap">
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th>{zh ? "时间" : "Time"}</th>
                      <th>{zh ? "模型" : "Model"}</th>
                      <th>{zh ? "密钥" : "Key"}</th>
                      <th className="is-num">{zh ? "Token" : "Tokens"}</th>
                      <th className="is-num">{zh ? "费用" : "Cost"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((row) => (
                      <tr key={row.id}>
                        <td className="ops-dim">{new Date(row.created_at).toLocaleString(locale)}</td>
                        <td>{row.model}</td>
                        <td className="mono">{maskKey(row.api_key_last4)}</td>
                        <td className="is-num">{formatNumber(row.input_tokens + row.output_tokens)}</td>
                        <td className="is-num">{formatYuan(row.cost_cents)}</td>
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
