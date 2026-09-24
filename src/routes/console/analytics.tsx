import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Coins,
  CreditCard,
  Layers,
  Pencil,
  Target,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getPlatformAnalytics } from "@/lib/fyt";
import { formatUsd, USD_SYMBOL } from "@/lib/format";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/analytics")({ component: AnalyticsPage });

type MetricMode = "all" | "users" | "paying" | "revenue";

interface TooltipPayloadItem {
  payload: {
    day: string;
    fullDate?: string;
    users: number;
    payingUsers: number;
    paidCents: number;
    paidAmount: number;
  };
}

function CustomAnalyticsTooltip({
  active,
  payload,
  label,
  zh,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  zh: boolean;
}) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="analytics-tooltip">
      <div className="analytics-tooltip-date">{item.fullDate || label}</div>
      <div className="analytics-tooltip-row">
        <span className="analytics-tooltip-label">
          <span className="analytics-dot is-green" />
          {zh ? "新增用户" : "New users"}
        </span>
        <strong className="analytics-tooltip-val">
          {item.users} {zh ? "人" : ""}
        </strong>
      </div>
      <div className="analytics-tooltip-row">
        <span className="analytics-tooltip-label">
          <span className="analytics-dot is-blue" />
          {zh ? "付款人数" : "Paying users"}
        </span>
        <strong className="analytics-tooltip-val">
          {item.payingUsers} {zh ? "人" : ""}
        </strong>
      </div>
      <div className="analytics-tooltip-row">
        <span className="analytics-tooltip-label">
          <span className="analytics-dot is-amber" />
          {zh ? "付款金额" : "Paid amount"}
        </span>
        <strong className="analytics-tooltip-val">
          {formatUsd(item.paidCents)}
        </strong>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const [data, setData] = useState<Awaited<ReturnType<typeof getPlatformAnalytics>> | null>(null);
  const [failed, setFailed] = useState(false);
  const [goal, setGoal] = useState(0);
  const [goalDraft, setGoalDraft] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricMode>("all");

  useEffect(() => {
    const saved = Number(localStorage.getItem("analytics-daily-user-goal"));
    if (Number.isFinite(saved) && saved > 0) setGoal(saved);
  }, []);

  useEffect(() => {
    void getPlatformAnalytics().then(setData).catch(() => setFailed(true));
  }, []);

  const deltaUsers = (data?.todayUsers ?? 0) - (data?.yesterdayUsers ?? 0);
  const positiveUsers = deltaUsers >= 0;
  const dailyGoal = goal || data?.yesterdayUsers || 1;
  const progress = Math.min(100, Math.round(((data?.todayUsers ?? 0) / dailyGoal) * 100));

  const deltaPaying = (data?.todayPayingUsers ?? 0) - (data?.yesterdayPayingUsers ?? 0);
  const deltaPaidCents = (data?.todayPaidCents ?? 0) - (data?.yesterdayPaidCents ?? 0);

  function saveGoal() {
    const next = Math.floor(Number(goalDraft));
    if (!Number.isFinite(next) || next < 1) return;
    setGoal(next);
    localStorage.setItem("analytics-daily-user-goal", String(next));
    setEditingGoal(false);
  }

  return (
    <section className="ops-page analytics-page">
      <header className="ops-head ops-rise" style={{ "--ops-i": 1 } as React.CSSProperties}>
        <div>
          <p className="ops-kicker">{zh ? "平台总览" : "Platform overview"}</p>
          <h1 className="ops-title">{zh ? "数据分析" : "Analytics"}</h1>
          <p className="ops-head-sub">
            {zh ? "追踪平台增长与付费表现。" : "Track platform growth and payment performance."}
          </p>
        </div>
        <span className="analytics-live">
          <i />
          {zh ? "实时统计" : "Live metrics"}
        </span>
      </header>

      {failed ? (
        <div className="ops-panel ops-panel-body">
          <p className="ops-empty">
            {zh ? "数据暂时无法载入，请稍后重试。" : "Analytics could not be loaded. Try again shortly."}
          </p>
        </div>
      ) : !data ? (
        <div className="analytics-metrics" aria-hidden="true">
          {[0, 1, 2, 3].map((n) => (
            <div className="analytics-metric ops-skel" key={n} />
          ))}
        </div>
      ) : (
        <>
          {/* Top Hero Daily Target Card */}
          <section
            className="analytics-daily-dashboard ops-rise"
            style={{ "--ops-i": 2 } as React.CSSProperties}
          >
            <div className="analytics-daily-heading">
              <div>
                <span className="analytics-daily-eyebrow">
                  <Target size={14} />
                  {zh ? "今日增长目标" : "Daily growth target"}
                </span>
                <h2>{zh ? "当日新增用户" : "New users today"}</h2>
              </div>
              {editingGoal ? (
                <div className="analytics-goal-editor">
                  <input
                    autoFocus
                    aria-label={zh ? "今日新增目标" : "Daily signup goal"}
                    inputMode="numeric"
                    type="number"
                    min="1"
                    value={goalDraft}
                    onChange={(event) => setGoalDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") saveGoal();
                      if (event.key === "Escape") setEditingGoal(false);
                    }}
                  />
                  <button type="button" onClick={saveGoal}>
                    {zh ? "保存" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="analytics-goal-cancel"
                    onClick={() => setEditingGoal(false)}
                  >
                    {zh ? "取消" : "Cancel"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="analytics-goal-edit"
                  onClick={() => {
                    setGoalDraft(String(dailyGoal));
                    setEditingGoal(true);
                  }}
                >
                  <Pencil size={14} />
                  {zh ? `目标 ${dailyGoal} 人` : `Goal ${dailyGoal}`}
                </button>
              )}
            </div>
            <div className="analytics-daily-main">
              <div className="analytics-daily-number">
                <strong>{data.todayUsers}</strong>
                <span>{zh ? "人" : "users"}</span>
              </div>
              <div className="analytics-daily-comparison">
                <span className={positiveUsers ? "is-positive" : "is-negative"}>
                  {positiveUsers ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(deltaUsers)}
                </span>
                <small>
                  {zh ? `较昨日新增 ${data.yesterdayUsers} 人` : `vs. ${data.yesterdayUsers} yesterday`}
                </small>
              </div>

              {/* Substats showing Today's Payment summary in hero */}
              <div className="analytics-daily-substats">
                <div className="analytics-daily-substat">
                  <span>
                    <CreditCard size={13} color="#0284c7" />
                    {zh ? "今日付款人数" : "Paying today"}
                  </span>
                  <strong>{data.todayPayingUsers} {zh ? "人" : ""}</strong>
                </div>
                <div className="analytics-daily-substat">
                  <span>
                    <CircleDollarSign size={13} color="#d97706" />
                    {zh ? "今日付款金额" : "Revenue today"}
                  </span>
                  <strong>{formatUsd(data.todayPaidCents)}</strong>
                </div>
              </div>

              <div
                className="analytics-gauge"
                role="img"
                aria-label={zh ? `今日目标完成 ${progress}%` : `${progress}% of today's goal`}
              >
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle className="analytics-gauge-track" cx="60" cy="60" r="48" />
                  <circle
                    className="analytics-gauge-value"
                    cx="60"
                    cy="60"
                    r="48"
                    style={{ "--gauge-progress": progress / 100 } as React.CSSProperties}
                  />
                </svg>
                <div>
                  <strong>{progress}%</strong>
                  <small>{zh ? "目标完成" : "of goal"}</small>
                </div>
              </div>
            </div>
            <div className="analytics-goal-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="analytics-goal-caption">
              <span>
                {zh ? `今日已新增 ${data.todayUsers} 人` : `${data.todayUsers} new users today`}
              </span>
              <span>
                {zh ? `目标 ${dailyGoal} 人` : `Target ${dailyGoal}`}
              </span>
            </div>
          </section>

          {/* 4 Metric Cards */}
          <div className="analytics-metrics">
            {/* 1. 今日付款人数 (Specifically requested by user) */}
            <article className="analytics-metric ops-rise" style={{ "--ops-i": 2 } as React.CSSProperties}>
              <div className="analytics-metric-top">
                <span>{zh ? "今日付款人数" : "Paying users today"}</span>
                <span className="analytics-icon is-blue">
                  <CreditCard size={17} />
                </span>
              </div>
              <strong>
                {data.todayPayingUsers}
                <span>{zh ? "人" : " users"}</span>
              </strong>
              <small className={cn("analytics-change", deltaPaying >= 0 ? "is-up" : "is-down")}>
                {deltaPaying >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {zh ? `较昨日 ${deltaPaying >= 0 ? "+" : ""}${deltaPaying} 人` : `${deltaPaying >= 0 ? "+" : ""}${deltaPaying} vs yesterday`}
              </small>
            </article>

            {/* 2. 今日付款金额 */}
            <article className="analytics-metric ops-rise" style={{ "--ops-i": 3 } as React.CSSProperties}>
              <div className="analytics-metric-top">
                <span>{zh ? "今日付款金额" : "Revenue today"}</span>
                <span className="analytics-icon is-amber">
                  <CircleDollarSign size={17} />
                </span>
              </div>
              <strong>{formatUsd(data.todayPaidCents)}</strong>
              <small className={cn("analytics-change", deltaPaidCents >= 0 ? "is-up" : "is-down")}>
                {deltaPaidCents >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {zh ? `较昨日 ${deltaPaidCents >= 0 ? "+" : "-"}${formatUsd(Math.abs(deltaPaidCents))}` : `${deltaPaidCents >= 0 ? "+" : "-"}${formatUsd(Math.abs(deltaPaidCents))} vs yesterday`}
              </small>
            </article>

            {/* 3. 累计用户 */}
            <article className="analytics-metric ops-rise" style={{ "--ops-i": 4 } as React.CSSProperties}>
              <div className="analytics-metric-top">
                <span>{zh ? "累计用户" : "Total users"}</span>
                <span className="analytics-icon is-green">
                  <Users size={17} />
                </span>
              </div>
              <strong>{data.totalUsers.toLocaleString(zh ? "zh-CN" : "en-US")}</strong>
              <small>{zh ? "平台注册账户" : "Registered accounts"}</small>
            </article>

            {/* 4. 累计付费金额 */}
            <article className="analytics-metric ops-rise" style={{ "--ops-i": 5 } as React.CSSProperties}>
              <div className="analytics-metric-top">
                <span>{zh ? "累计付费金额" : "Total paid"}</span>
                <span className="analytics-icon is-neutral">
                  <Coins size={17} />
                </span>
              </div>
              <strong>{formatUsd(data.totalPaidCents)}</strong>
              <small>{zh ? "平台累计流水" : "Cumulative platform revenue"}</small>
            </article>
          </div>

          {/* Multi-curve Analytics Chart */}
          <section
            className="ops-panel analytics-chart-panel ops-rise"
            style={{ "--ops-i": 6 } as React.CSSProperties}
          >
            <div className="ops-panel-head analytics-panel-head">
              <div>
                <h2 className="ops-panel-title">
                  {zh ? "核心运营趋势" : "Core operational trends"}
                </h2>
                <p className="ops-panel-sub">
                  {zh
                    ? "展示最近 7 天新增用户数、付款人数与付款金额动态曲线"
                    : "New users, paying users, and revenue curves over the last 7 days"}
                </p>
              </div>

              {/* Metric View Switcher Tabs */}
              <div className="analytics-chart-controls">
                <div className="analytics-tabs" role="tablist" aria-label={zh ? "曲线指标切换" : "Chart metric selection"}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMetric === "all"}
                    className={cn("analytics-tab", activeMetric === "all" && "is-active")}
                    onClick={() => setActiveMetric("all")}
                  >
                    <Layers size={13} />
                    {zh ? "多维对比" : "Combined"}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMetric === "users"}
                    className={cn("analytics-tab", activeMetric === "users" && "is-active")}
                    onClick={() => setActiveMetric("users")}
                  >
                    <span className="analytics-dot is-green" />
                    {zh ? "新增用户" : "New users"}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMetric === "paying"}
                    className={cn("analytics-tab", activeMetric === "paying" && "is-active")}
                    onClick={() => setActiveMetric("paying")}
                  >
                    <span className="analytics-dot is-blue" />
                    {zh ? "付款人数" : "Paying users"}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMetric === "revenue"}
                    className={cn("analytics-tab", activeMetric === "revenue" && "is-active")}
                    onClick={() => setActiveMetric("revenue")}
                  >
                    <span className="analytics-dot is-amber" />
                    {zh ? "付款金额" : "Revenue"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick summary badges */}
            <div className="analytics-chart-pills">
              <span className="analytics-pill">
                <span className="analytics-dot is-green" />
                {zh ? "今日新增" : "New today"}:
                <strong>{data.todayUsers} {zh ? "人" : ""}</strong>
              </span>
              <span className="analytics-pill">
                <span className="analytics-dot is-blue" />
                {zh ? "今日付款人数" : "Paying today"}:
                <strong>{data.todayPayingUsers} {zh ? "人" : ""}</strong>
              </span>
              <span className="analytics-pill">
                <span className="analytics-dot is-amber" />
                {zh ? "今日付款金额" : "Revenue today"}:
                <strong>{formatUsd(data.todayPaidCents)}</strong>
              </span>
            </div>

            <div className="analytics-chart">
              {data.days.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.days}
                    margin={{ top: 16, right: activeMetric === "all" ? 14 : 10, left: -14, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="analyticsUsersFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#718b2d" stopOpacity={0.24} />
                        <stop offset="100%" stopColor="#718b2d" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="analyticsPayingFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity={0.24} />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="analyticsRevenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid stroke="rgba(17,18,20,.07)" vertical={false} />

                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#8b9086", fontSize: 11 }}
                      dy={10}
                    />

                    {/* Left YAxis for Person counts */}
                    {(activeMetric === "all" || activeMetric === "users" || activeMetric === "paying") && (
                      <YAxis
                        yAxisId="count"
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#8b9086", fontSize: 11 }}
                        unit={zh ? "人" : ""}
                      />
                    )}

                    {/* Right YAxis for Dollar Amount in Combined mode, or single YAxis in Revenue mode */}
                    {activeMetric === "all" ? (
                      <YAxis
                        yAxisId="amount"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#8b9086", fontSize: 11 }}
                        tickFormatter={(v: number) => `${USD_SYMBOL}${v}`}
                      />
                    ) : activeMetric === "revenue" ? (
                      <YAxis
                        yAxisId="amount"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#8b9086", fontSize: 11 }}
                        tickFormatter={(v: number) => `${USD_SYMBOL}${v}`}
                      />
                    ) : null}

                    <Tooltip content={<CustomAnalyticsTooltip zh={zh} />} />

                    {/* Curve 1: 新增用户数 */}
                    {(activeMetric === "all" || activeMetric === "users") && (
                      <Area
                        yAxisId="count"
                        type="monotone"
                        dataKey="users"
                        name={zh ? "新增用户" : "New users"}
                        stroke="#718b2d"
                        strokeWidth={2.4}
                        fill="url(#analyticsUsersFill)"
                        activeDot={{ r: 4.5, fill: "#718b2d", strokeWidth: 0 }}
                      />
                    )}

                    {/* Curve 2: 付款人数 */}
                    {(activeMetric === "all" || activeMetric === "paying") && (
                      <Area
                        yAxisId="count"
                        type="monotone"
                        dataKey="payingUsers"
                        name={zh ? "付款人数" : "Paying users"}
                        stroke="#0284c7"
                        strokeWidth={2.4}
                        fill="url(#analyticsPayingFill)"
                        activeDot={{ r: 4.5, fill: "#0284c7", strokeWidth: 0 }}
                      />
                    )}

                    {/* Curve 3: 付款金额 */}
                    {(activeMetric === "all" || activeMetric === "revenue") && (
                      <Area
                        yAxisId="amount"
                        type="monotone"
                        dataKey="paidAmount"
                        name={zh ? "付款金额" : "Paid amount"}
                        stroke="#d97706"
                        strokeWidth={2.4}
                        fill="url(#analyticsRevenueFill)"
                        activeDot={{ r: 4.5, fill: "#d97706", strokeWidth: 0 }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="analytics-chart-empty">
                  {zh ? "最近 7 天暂无运营数据" : "No activity in the last 7 days"}
                </div>
              )}
            </div>
          </section>

          <p className="analytics-footnote">
            {zh
              ? "统计依据为平台账户注册时间与实时支付流水。多维对比下左侧 Y 轴为用户人数，右侧 Y 轴为充值金额 ($)。"
              : "Metrics are generated from account registrations and live payment records. Left Y-axis tracks user counts, right Y-axis tracks dollar revenue."}
          </p>
        </>
      )}

      <div className="analytics-shortcut">
        <Link to="/console/overview">
          {zh ? "返回个人概况" : "Back to personal overview"}
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
