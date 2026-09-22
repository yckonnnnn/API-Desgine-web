import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Coins,
  Hash,
  KeyRound,
  Plus,
  Receipt,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getBilling, getDashboard, getUsage, listKeys } from "@/lib/fyt";
import { formatNumber, formatTokens, formatYuan, maskKey } from "@/lib/format";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/console/")({ component: Overview });

/** Stagger index for the page entrance — see `.ops-rise` in styles.css. */
const rise = (i: number) => ({ "--ops-i": i }) as CSSProperties;
type ChartMode = "tokens" | "cost";

function Overview() {
  const user = useCurrentUser();
  const { language } = useLanguage();
  const zh = language === "zh";

  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [usage, setUsage] = useState<Awaited<ReturnType<typeof getUsage>> | null>(null);
  const [activity, setActivity] = useState<Awaited<ReturnType<typeof getBilling>> | null>(null);
  const [keys, setKeys] = useState<Awaited<ReturnType<typeof listKeys>> | null>(null);
  const [failed, setFailed] = useState(false);
  const [usageFailed, setUsageFailed] = useState(false);
  const [billingFailed, setBillingFailed] = useState(false);
  const [chartMode, setChartMode] = useState<ChartMode>("tokens");

  useEffect(() => {
    void getDashboard()
      .then(setData)
      .catch(() => setFailed(true));
    void getUsage()
      .then(setUsage)
      .catch(() => setUsageFailed(true));
    void getBilling()
      .then(setActivity)
      .catch(() => setBillingFailed(true));
    // Failure here only leaves the key card blank; the page keeps working.
    void listKeys()
      .then(setKeys)
      .catch(() => setKeys([]));
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
      cost: d.cost_cents,
    })) ?? [];

  const locale = zh ? "zh-CN" : "en-US";
  /**
   * The key the card shows: a live one when there is one, otherwise the most
   * recent — the block is honest about the state rather than always showing a
   * key that no longer works.
   */
  const primaryKey = keys?.find((k) => !k.disabled) ?? keys?.[0] ?? null;
  const inputTokens = usage?.days.reduce((sum, day) => sum + day.input_tokens, 0) ?? 0;
  const outputTokens = usage?.days.reduce((sum, day) => sum + day.output_tokens, 0) ?? 0;
  const periodTokens = inputTokens + outputTokens;
  const inputShare = periodTokens > 0 ? Math.round((inputTokens / periodTokens) * 100) : 0;
  const tokenMixStyle = { "--overview-input-share": `${inputShare}%` } as CSSProperties;

  return (
    <section className="ops-page overview-page">
      <header className="ops-head overview-head ops-rise" style={rise(1)}>
        <div>
          <h1 className="ops-title">
            {title}
            <span className="overview-wave" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p className="ops-head-sub">
            {zh
              ? "你的余额、模型调用和费用，一眼看清。"
              : "A clear view of your balance, model requests and usage."}
          </p>
        </div>
        <Link to="/console/usage" className="overview-heading-action">
          <Activity size={17} />
          {zh ? "查看用量报告" : "View usage report"}
          <ArrowUpRight size={16} />
        </Link>
      </header>

      {failed ? (
        <div className="ops-panel ops-rise" style={rise(1)}>
          <p className="ops-empty">
            {zh ? "工作台加载失败，请稍后再试。" : "Unable to load the workspace."}
          </p>
        </div>
      ) : !data ? (
        <div className="overview-dashboard-grid overview-loading" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overview-card ops-rise" style={rise(2 + i)}>
              <div className="ops-skel" style={{ width: 110, height: 15 }} />
              <div className="ops-skel" style={{ width: "100%", height: 185, marginTop: 25 }} />
              <div className="ops-skel" style={{ width: "75%", height: 15, marginTop: 24 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="ops-stack overview-content">
          <div className="overview-dashboard-grid">
            <section className="overview-workspace overview-card ops-rise" style={rise(2)}>
              <div className="overview-card-heading">
                <h2>{zh ? "工作台" : "Workspace"}</h2>
                <span className="overview-card-icon">
                  <KeyRound size={17} />
                </span>
              </div>
              <div className="overview-key">
                {primaryKey ? (
                  <>
                    <p className="overview-key-label">
                      {zh ? "当前密钥" : "Active key"}
                      <span>{zh ? `共 ${keys?.length ?? 0} 个` : `${keys?.length ?? 0} total`}</span>
                    </p>
                    <p className="overview-key-value">{maskKey(primaryKey.last4)}</p>
                    <p className="overview-key-meta">
                      <i
                        className={primaryKey.disabled ? "overview-key-dot" : "overview-key-dot is-live"}
                        aria-hidden="true"
                      />
                      {primaryKey.name}
                      <span aria-hidden="true">·</span>
                      <span className="overview-key-date">
                        {new Date(primaryKey.created_at).toLocaleDateString(locale)}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="overview-key-empty">
                    {keys === null
                      ? zh
                        ? "正在载入密钥…"
                        : "Loading keys…"
                      : zh
                        ? "还没有密钥，先去创建一个。"
                        : "No keys yet — create your first one."}
                  </p>
                )}
                <Link to="/console/keys" className="overview-key-action" data-cursor="hover">
                  <KeyRound size={15} strokeWidth={1.9} aria-hidden="true" />
                  {zh ? "管理密钥" : "Manage keys"}
                  <ArrowRight size={15} strokeWidth={1.9} aria-hidden="true" />
                </Link>
              </div>
              <div className="overview-workspace-links">
                <Link to="/console/keys">
                  <span className="overview-link-icon">
                    <KeyRound size={17} />
                  </span>
                  <span>
                    <strong>{zh ? "管理 API 密钥" : "Manage API keys"}</strong>
                    <small>{zh ? "创建与查看访问密钥" : "Create and view access keys"}</small>
                  </span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/console/usage">
                  <span className="overview-link-icon">
                    <Activity size={17} />
                  </span>
                  <span>
                    <strong>{zh ? "查看用量" : "Explore usage"}</strong>
                    <small>{zh ? "了解模型调用趋势" : "See model usage trends"}</small>
                  </span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/console/billing">
                  <span className="overview-link-icon">
                    <Receipt size={17} />
                  </span>
                  <span>
                    <strong>{zh ? "费用明细" : "Billing details"}</strong>
                    <small>{zh ? "查看每笔请求扣费" : "Review each request charge"}</small>
                  </span>
                  <ArrowRight size={17} />
                </Link>
              </div>
            </section>
            <div className="overview-middle-stack">
              <section className="overview-pocket overview-card ops-rise" style={rise(3)}>
                <div className="overview-card-heading">
                  <h2>{zh ? "Token 构成" : "Token mix"}</h2>
                  <Link to="/console/usage" className="overview-soft-link">
                    {zh ? "查看全部" : "View all"}
                  </Link>
                </div>
                {usageFailed ? (
                  <p className="overview-card-message">
                    {zh ? "用量暂时无法加载" : "Usage is unavailable"}
                  </p>
                ) : usage === null ? (
                  <div
                    className="overview-donut overview-donut-loading ops-skel"
                    aria-hidden="true"
                  />
                ) : (
                  <div
                    className={`overview-donut${periodTokens === 0 ? " is-empty" : ""}`}
                    style={tokenMixStyle}
                    role="img"
                    aria-label={
                      zh
                        ? `输入 ${inputShare}%，输出 ${100 - inputShare}%`
                        : `Input ${inputShare}%, output ${100 - inputShare}%`
                    }
                  >
                    <div className="overview-donut-core">
                      <strong>{periodTokens ? formatTokens(periodTokens) : "0"}</strong>
                      <span>Token</span>
                    </div>
                  </div>
                )}
                <div className="overview-donut-legend">
                  <div>
                    <i className="is-input" />
                    {zh ? "输入" : "Input"}
                    <strong>{usage ? formatTokens(inputTokens) : "—"}</strong>
                  </div>
                  <div>
                    <i className="is-output" />
                    {zh ? "输出" : "Output"}
                    <strong>{usage ? formatTokens(outputTokens) : "—"}</strong>
                  </div>
                </div>
                <p className="overview-period-note">
                  {zh ? "根据最近用量记录统计" : "Based on recent usage records"}
                </p>
              </section>
              <div className="overview-mini-grid ops-rise" style={rise(4)}>
                <section className="overview-mini-card">
                  <span>
                    <Coins size={17} />
                    {zh ? "今日消费" : "Spent today"}
                  </span>
                  <strong>{formatYuan(data.todaySpendCents)}</strong>
                  <small>{zh ? "今日累计费用" : "Today's charges"}</small>
                </section>
                <section className="overview-mini-card">
                  <span>
                    <Hash size={17} />
                    {zh ? "请求总数" : "Requests"}
                  </span>
                  <strong>{formatNumber(data.requests)}</strong>
                  <small>{zh ? "累计 API 调用" : "Total API calls"}</small>
                </section>
              </div>
            </div>
            <div className="overview-right-stack">
              <section className="overview-balance overview-card ops-rise" style={rise(3)}>
                <div className="overview-balance-orbit" aria-hidden="true" />
                <p>{zh ? "可用余额" : "Available balance"}</p>
                <strong>{formatYuan(data.balanceCents)}</strong>
                <div className="overview-balance-actions">
                  <Link to="/console/wallet">
                    <span>
                      <Plus size={18} />
                    </span>
                    {zh ? "充值" : "Add funds"}
                  </Link>
                  <Link to="/console/keys">
                    <span>
                      <KeyRound size={18} />
                    </span>
                    {zh ? "密钥" : "API keys"}
                  </Link>
                  <Link to="/console/usage">
                    <span>
                      <Activity size={18} />
                    </span>
                    {zh ? "用量" : "Usage"}
                  </Link>
                  <Link to="/console/billing">
                    <span>
                      <Receipt size={18} />
                    </span>
                    {zh ? "账单" : "Billing"}
                  </Link>
                </div>
              </section>
              <section className="overview-snapshot overview-card ops-rise" style={rise(4)}>
                <div className="overview-card-heading">
                  <h2>{zh ? "调用表现" : "Request health"}</h2>
                  <CheckCircle2 size={18} />
                </div>
                <div className="overview-snapshot-value">
                  <strong>{(data.successBps / 100).toFixed(2)}%</strong>
                  <span>{zh ? "请求成功率" : "success rate"}</span>
                </div>
                <div
                  className="overview-health-track"
                  role="meter"
                  aria-label={zh ? "请求成功率" : "Success rate"}
                  aria-valuenow={data.successBps / 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span
                    style={{ width: `${Math.min(100, Math.max(0, data.successBps / 100))}%` }}
                  />
                </div>
                <p>{zh ? "来自当前工作台的实际请求" : "Based on this workspace's requests"}</p>
              </section>
            </div>
          </div>

          <section className="overview-panel ops-rise" style={rise(4)}>
            <div className="overview-panel-head">
              <div>
                <p className="overview-panel-kicker">{zh ? "使用趋势" : "Usage trend"}</p>
                <h2>
                  {chartMode === "tokens"
                    ? zh
                      ? "Token 用量"
                      : "Token usage"
                    : zh
                      ? "每日费用"
                      : "Daily cost"}
                </h2>
                <p>
                  {usage === null && !usageFailed
                    ? zh
                      ? "正在加载用量记录"
                      : "Loading usage records"
                    : zh
                      ? `近 ${chart.length} 天的实际记录`
                      : `Actual records from the last ${chart.length} days`}
                </p>
              </div>
              <div className="overview-chart-actions">
                <div
                  className="overview-chart-switch"
                  role="group"
                  aria-label={zh ? "图表类型" : "Chart type"}
                >
                  <button
                    type="button"
                    className={chartMode === "tokens" ? "is-on" : ""}
                    aria-pressed={chartMode === "tokens"}
                    onClick={() => setChartMode("tokens")}
                  >
                    {zh ? "Token" : "Tokens"}
                  </button>
                  <button
                    type="button"
                    className={chartMode === "cost" ? "is-on" : ""}
                    aria-pressed={chartMode === "cost"}
                    onClick={() => setChartMode("cost")}
                  >
                    {zh ? "费用" : "Cost"}
                  </button>
                </div>
                <Link to="/console/usage" className="ops-link-inline" data-cursor="hover">
                  {zh ? "查看详情" : "View usage"}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="overview-chart">
              {usageFailed ? (
                <p className="overview-no-data">
                  {zh ? "用量暂时无法加载" : "Usage is unavailable"}
                </p>
              ) : usage === null ? (
                <div className="overview-chart-skeleton ops-skel" aria-hidden="true" />
              ) : chart.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartMode === "tokens" ? (
                    <AreaChart data={chart} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="overview-tokens-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-acid)" stopOpacity={0.38} />
                          <stop offset="100%" stopColor="var(--color-acid)" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        stroke="rgba(17,18,20,.07)"
                        strokeDasharray="3 5"
                      />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#92969D", fontSize: 11 }}
                        dy={12}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#92969D", fontSize: 11 }}
                        tickFormatter={formatTokens}
                        width={54}
                      />
                      <Tooltip
                        content={({ active, payload, label }) =>
                          active && payload?.[0] ? (
                            <div className="overview-chart-tip">
                              <span>{label}</span>
                              <strong>{formatTokens(Number(payload[0].value))} Token</strong>
                            </div>
                          ) : null
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="tokens"
                        isAnimationActive={false}
                        stroke="var(--color-acid-ink)"
                        strokeWidth={2.5}
                        fill="url(#overview-tokens-fill)"
                        activeDot={{
                          r: 5,
                          fill: "var(--color-acid-ink)",
                          stroke: "white",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={chart} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid
                        vertical={false}
                        stroke="rgba(17,18,20,.07)"
                        strokeDasharray="3 5"
                      />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#92969D", fontSize: 11 }}
                        dy={12}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#92969D", fontSize: 11 }}
                        tickFormatter={(value: number) => formatYuan(value)}
                        width={54}
                      />
                      <Tooltip
                        content={({ active, payload, label }) =>
                          active && payload?.[0] ? (
                            <div className="overview-chart-tip">
                              <span>{label}</span>
                              <strong>{formatYuan(Number(payload[0].value))}</strong>
                            </div>
                          ) : null
                        }
                      />
                      <Bar
                        dataKey="cost"
                        isAnimationActive={false}
                        fill="var(--color-acid-ink)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={32}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <p className="overview-no-data">{zh ? "暂无用量记录" : "No usage records yet"}</p>
              )}
            </div>
          </section>

          <section className="overview-panel ops-rise" style={rise(5)}>
            <div className="overview-panel-head">
              <div>
                <p className="overview-panel-kicker">{zh ? "最近活动" : "Recent activity"}</p>
                <h2>{zh ? "最近请求" : "Recent requests"}</h2>
                <p>{zh ? "本工作台最新的扣费记录" : "Latest charges on this workspace"}</p>
              </div>
              <Link to="/console/billing" className="ops-link-inline" data-cursor="hover">
                {zh ? "完整账单" : "Full ledger"}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            {billingFailed ? (
              <p className="overview-no-data">
                {zh ? "最近请求暂时无法加载" : "Recent requests are unavailable"}
              </p>
            ) : activity === null ? (
              <div className="overview-table-skeleton ops-skel" aria-hidden="true" />
            ) : activity.length ? (
              <div className="ops-table-wrap overview-table-wrap">
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
                    {activity.slice(0, 6).map((row) => (
                      <tr key={row.id}>
                        <td className="ops-dim">
                          {new Date(row.created_at).toLocaleString(locale)}
                        </td>
                        <td>{row.model}</td>
                        <td className="mono">{maskKey(row.api_key_last4)}</td>
                        <td className="is-num">
                          {formatNumber(row.input_tokens + row.output_tokens)}
                        </td>
                        <td className="is-num">{formatYuan(row.cost_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="overview-no-data">{zh ? "还没有请求记录" : "No requests yet"}</p>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
