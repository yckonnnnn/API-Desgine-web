import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Activity, Check, Coins, Eye, EyeOff, Plus, Wallet, X } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { addFunds, getDashboard, getUsage, getWallet } from "@/lib/fyt";
import { formatNumber, formatYuan } from "@/lib/format";
import { useLanguage } from "@/lib/language";
import { PLANS, findPlan, isFeaturedPlan, type Plan, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

/**
 * `?plan=<id>` is how the marketing page hands a chosen plan over: the credit
 * pack you click there opens this page with that plan's checkout already up, so
 * arriving from the homepage doesn't just dump you on a generic top-up form.
 * Unknown ids resolve to nothing rather than throwing — the param is typeable.
 */
export const Route = createFileRoute("/console/wallet")({
  validateSearch: (search: Record<string, unknown>): { plan?: PlanId } => {
    const plan = findPlan(typeof search.plan === "string" ? search.plan : undefined);
    return plan ? { plan: plan.id } : {};
  },
  component: WalletPage,
});

const QUICK_AMOUNTS = [100, 200, 500, 1000] as const;
const MIN_AMOUNT = 1;

/**
 * `¥4,999.50` → `¥********`. Every character of the number is redacted, commas
 * and decimal point included: keeping them would still spell out the amount's
 * shape (four digits here, two decimals there), which is exactly what the eye
 * toggle is meant to hide. Same length in, same length out, so the balance
 * never shifts the card when it is toggled.
 */
function redactAmount(formatted: string) {
  return formatted.replace(/[\d.,]/g, "*");
}

/**
 * Checkout for one named plan.
 *
 * Deliberately NOT the top-up sheet with an amount pre-filled. Arriving here
 * from a credit pack on the marketing page has to read as buying *that plan*,
 * so this shows an order — what the plan includes, what it costs, what you pay
 * — and carries no amount picker at all. The amount grid stays where it belongs,
 * behind the wallet card's own top-up button.
 */
function PlanCheckoutSheet({
  plan,
  zh,
  busy,
  balance,
  onClose,
  onPay,
}: {
  plan: Plan;
  zh: boolean;
  busy: boolean;
  balance: number | null;
  onClose: () => void;
  onPay: () => void;
}) {
  const Icon = plan.icon;
  const price = formatYuan(plan.amount * 100);

  return (
    <div
      className="modal-layer wallet-modal-layer"
      role="dialog"
      aria-modal="true"
      aria-label={zh ? `订阅 ${plan.name}` : `Subscribe to ${plan.name}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="topup-sheet plan-sheet">
        <div className="topup-intro">
          <span className="topup-intro-mark" aria-hidden="true">
            <Icon size={17} strokeWidth={2.2} />
          </span>
          <button
            type="button"
            className="topup-close"
            aria-label={zh ? "关闭" : "Close"}
            data-cursor="hover"
            onClick={onClose}
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <h2 className="topup-title">
            {zh ? `订阅 ${plan.name} 套餐` : `Subscribe to ${plan.name}`}
          </h2>
          <p className="topup-sub">
            {zh
              ? "一次性付款，额度直接充入钱包，用完再充。"
              : "One-time payment — the credit lands in your wallet straight away."}
          </p>
        </div>

        <div className="topup-body">
          <div className="plan-order">
            <header className="plan-order-head">
              <span className="plan-order-icon" aria-hidden="true">
                <Icon size={19} strokeWidth={1.9} />
              </span>
              <div className="plan-order-id">
                <h3>{plan.name}</h3>
                <p>{zh ? plan.desc.zh : plan.desc.en}</p>
              </div>
              <span className="plan-order-price">{price}</span>
            </header>

            <ul className="plan-order-perks">
              {plan.perks.map((perk) => (
                <li key={perk.en}>
                  <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                  {zh ? perk.zh : perk.en}
                </li>
              ))}
            </ul>
          </div>

          <div className="topup-total">
            <div className="topup-total-row">
              <span>{zh ? "当前余额" : "Current balance"}</span>
              <span>{balance == null ? "—" : formatYuan(balance)}</span>
            </div>
            <div className="topup-total-row">
              <span>{zh ? "套餐额度" : "Package credit"}</span>
              <span>{price}</span>
            </div>
            <div className="topup-total-row is-payable">
              <span>{zh ? "应付金额" : "You pay"}</span>
              <strong>{price}</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-acid topup-pay"
          data-cursor="hover"
          disabled={busy}
          onClick={onPay}
        >
          {busy
            ? zh
              ? "处理中…"
              : "Processing…"
            : zh
              ? `确认支付 ${price}`
              : `Pay ${price}`}
          <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <p className="topup-secure">
          {zh ? "加密传输 · 支付后实时到账" : "Encrypted in transit · Credited instantly"}
        </p>
      </div>
    </div>
  );
}

function WalletPage() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const navigate = useNavigate();
  const { plan: planParam } = Route.useSearch();

  const [balance, setBalance] = useState<number | null>(null);
  const [requests, setRequests] = useState<number | null>(null);
  const [totalSpend, setTotalSpend] = useState<number | null>(null);
  const [spend, setSpend] = useState<{ day: string; cost: number }[]>([]);
  /** Masking the balance is a shoulder-surfing guard, not a setting — it is
   *  deliberately not persisted, so it never comes back hidden by surprise. */
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  /** The plan being checked out, when a specific one was chosen. Distinct from
   *  `open`: the top-up sheet is "pick an amount", this is "buy this plan". */
  const [checkout, setCheckout] = useState<Plan | null>(null);
  const [amount, setAmount] = useState(200);
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const load = () => {
    void getWallet()
      .then((w) => setBalance(w.balanceCents))
      .catch(() => setBalance(0));
    void getDashboard()
      .then((d) => setRequests(d.requests))
      .catch(() => undefined);
    void getUsage()
      .then((u) => {
        setTotalSpend(u.cost);
        setSpend(u.days.slice(-14).map((d) => ({ day: d.day.slice(5), cost: d.cost_cents })));
      })
      .catch(() => undefined);
  };

  useEffect(load, []);

  // Escape closes whichever sheet is up. Inlined rather than calling
  // `closeCheckout` so the effect doesn't depend on a function rebuilt every
  // render — its dependencies already fire exactly when the target changes.
  useEffect(() => {
    if (!open && !checkout) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setCheckout(null);
      if (planParam) void navigate({ to: "/console/wallet", search: {}, replace: true });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, checkout, planParam, navigate]);

  // Arriving with a plan chosen — from a credit pack on the marketing page —
  // opens its checkout on the first pass. `planParam` is already validated
  // against the plan list by the route, so there is nothing to verify here.
  useEffect(() => {
    const plan = findPlan(planParam);
    if (plan) setCheckout(plan);
  }, [planParam]);

  const active = custom.trim() ? Number(custom) : amount;
  const valid = Number.isFinite(active) && active >= MIN_AMOUNT;

  function openTopUp(next?: number) {
    if (next) {
      setAmount(next);
      setCustom("");
    }
    setNote(null);
    setOpen(true);
  }

  function openCheckout(plan: Plan) {
    setNote(null);
    setCheckout(plan);
  }

  /**
   * Dismissing the checkout also drops `?plan=` from the URL. Without that the
   * sheet comes back on every refresh and on every back-navigation, which reads
   * as the page refusing to let you leave the purchase.
   */
  function closeCheckout() {
    setCheckout(null);
    if (planParam) void navigate({ to: "/console/wallet", search: {}, replace: true });
  }

  function submit() {
    if (!valid || busy) return;
    setBusy(true);
    setNote(null);
    void addFunds({ data: active })
      .then((w) => {
        setBalance(w.balanceCents);
        setOpen(false);
        setCustom("");
        setNote(zh ? `已充值 ${formatYuan(active * 100)}` : `Added ${formatYuan(active * 100)} to your balance.`);
      })
      .catch(() => setNote(zh ? "充值失败，请稍后再试。" : "Unable to complete the top-up."))
      .finally(() => setBusy(false));
  }

  /** Same endpoint as the top-up — a plan is a fixed amount of the same credit —
   *  but the confirmation names the plan, because that is what was bought. */
  function submitCheckout() {
    if (!checkout || busy) return;
    const plan = checkout;
    const paid = formatYuan(plan.amount * 100);
    setBusy(true);
    setNote(null);
    void addFunds({ data: plan.amount })
      .then((w) => {
        setBalance(w.balanceCents);
        closeCheckout();
        setNote(
          zh ? `${plan.name} 套餐已开通，${paid} 已到账。` : `${plan.name} is active — ${paid} added to your wallet.`,
        );
      })
      .catch(() =>
        setNote(zh ? "支付失败，请稍后再试。" : "Payment could not be completed. Please try again."),
      )
      .finally(() => setBusy(false));
  }

  return (
    <section className="console-page wallet-page">
      <header className="console-page-head wallet-head">
        <h1 className="console-title">{zh ? "钱包" : "Wallet"}</h1>
        <Link to="/console/billing" className="console-link-inline" data-cursor="hover">
          {zh ? "计费历史" : "Billing history"}
        </Link>
      </header>

      <div className="wallet-hero">
        <div className="wallet-card-stack">
          <div className="wallet-card">
            <div className="wallet-card-top">
              <div className="wallet-card-id">
                <span className="wallet-card-brand">
                  Foyton<span>Wallet</span>
                </span>
                <span className="wallet-card-mark" aria-hidden="true">
                  <Wallet size={17} strokeWidth={1.9} />
                </span>
              </div>
              <button
                type="button"
                className="wallet-card-topup"
                data-cursor="hover"
                onClick={() => openTopUp()}
              >
                <Plus size={14} strokeWidth={2.7} className="wallet-card-topup-plus" aria-hidden="true" />
                {zh ? "充值" : "Top up"}
                {/* Two arrows in one clipped frame: the one on screen leaves
                    and the one behind it takes its place, so the button points
                    onward instead of just sitting there. */}
                <span className="wallet-card-topup-go" aria-hidden="true">
                  <ArrowUpRight size={14} strokeWidth={2.4} className="wallet-card-topup-arrow" />
                  <ArrowUpRight size={14} strokeWidth={2.4} className="wallet-card-topup-arrow is-trailing" />
                </span>
              </button>
            </div>
            <div className="wallet-card-body">
              <p className="wallet-card-label">
                {zh ? "可用余额" : "Available balance"}
                <button
                  type="button"
                  className="wallet-card-eye"
                  data-cursor="hover"
                  aria-pressed={hidden}
                  aria-label={
                    hidden
                      ? zh
                        ? "显示余额"
                        : "Show balance"
                      : zh
                        ? "隐藏余额"
                        : "Hide balance"
                  }
                  onClick={() => setHidden((was) => !was)}
                >
                  {hidden ? (
                    <EyeOff size={15} strokeWidth={2.1} aria-hidden="true" />
                  ) : (
                    <Eye size={15} strokeWidth={2.1} aria-hidden="true" />
                  )}
                </button>
              </p>
              <p className="wallet-card-value">
                {balance == null
                  ? "—"
                  : hidden
                    ? redactAmount(formatYuan(balance))
                    : formatYuan(balance)}
              </p>
            </div>
          </div>
        </div>

        <div className="wallet-side">
          <div className="wallet-side-head">
            <h2>{zh ? "账户概览" : "Account"}</h2>
            <span>{zh ? "近 14 天消费" : "Last 14 days"}</span>
          </div>

          <dl className="wallet-stats">
            <div>
              <span className="wallet-stat-icon" aria-hidden="true">
                <Coins size={16} strokeWidth={1.9} />
              </span>
              <dt>{zh ? "总用量" : "Total spend"}</dt>
              <dd>{totalSpend == null ? "—" : formatYuan(totalSpend)}</dd>
            </div>
            <div>
              <span className="wallet-stat-icon" aria-hidden="true">
                <Activity size={16} strokeWidth={1.9} />
              </span>
              <dt>{zh ? "API 请求" : "API requests"}</dt>
              <dd>{requests == null ? "—" : formatNumber(requests)}</dd>
            </div>
          </dl>

          <div className="wallet-spark">
            {spend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="walletSpendBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#cbf24f" />
                      <stop offset="100%" stopColor="#93c22a" />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    cursor={{ fill: "rgb(17 18 20 / 0.05)" }}
                    content={({ active, payload, label }) =>
                      active && payload?.[0] ? (
                        <div className="wallet-spark-tip">
                          <span>{label}</span>
                          <strong>{formatYuan(Number(payload[0].value))}</strong>
                        </div>
                      ) : null
                    }
                  />
                  <Bar
                    dataKey="cost"
                    isAnimationActive={false}
                    fill="url(#walletSpendBar)"
                    maxBarSize={16}
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          {/* The top-up action now lives on the card itself, so the panel closes
              on the note alone — the last line of its own story. */}
          <p className="wallet-side-note">
            {zh
              ? "充值后额度立即到账，按实际用量扣费。"
              : "Credit lands straight away, and is spent as you use it."}
          </p>
        </div>
      </div>

      {note ? <p className="wallet-flash">{note}</p> : null}

      {/* Packages */}
      <div className="wallet-plans-head">
        <div>
          <h2 className="console-panel-title">{zh ? "充值套餐" : "Top-up packages"}</h2>
          <p className="console-panel-sub">
            {zh
              ? "一次性付款，额度直接充入钱包，用完再充。"
              : "One-time payment — the credit lands in your wallet straight away."}
          </p>
        </div>
      </div>

      <div className="wallet-plans">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <article key={plan.id} className={cn("wallet-plan", `is-${plan.tone}`)}>
              {plan.badge ? (
                <span className="wallet-plan-badge">{zh ? plan.badge.zh : plan.badge.en}</span>
              ) : null}

              <header className="wallet-plan-top">
                <span className="wallet-plan-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <h3>{plan.name}</h3>
                <p className="wallet-plan-desc">{zh ? plan.desc.zh : plan.desc.en}</p>
              </header>

              <p className="wallet-plan-amount">
                {formatYuan(plan.amount * 100)}
                <span>{zh ? "套餐额度" : "credit"}</span>
              </p>

              <ul className="wallet-plan-perks">
                {plan.perks.map((perk) => (
                  <li key={perk.en}>
                    <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                    {zh ? perk.zh : perk.en}
                  </li>
                ))}
              </ul>

              <p className="wallet-plan-note">
                <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                {zh ? "支付后即时到账" : "Credited on payment"}
              </p>

              <button
                type="button"
                className="wallet-plan-cta"
                data-cursor="hover"
                onClick={() => openCheckout(plan)}
              >
                {zh ? "立即订阅" : "Subscribe"}
              </button>
            </article>
          );
        })}
      </div>

      {checkout && typeof document !== "undefined"
        ? createPortal(
            <PlanCheckoutSheet
              plan={checkout}
              zh={zh}
              busy={busy}
              balance={balance}
              onClose={closeCheckout}
              onPay={submitCheckout}
            />,
            document.body,
          )
        : null}

      {open && typeof document !== "undefined" ? createPortal(
        <div
          className="modal-layer wallet-modal-layer"
          role="dialog"
          aria-modal="true"
          aria-label={zh ? "充值余额" : "Top up balance"}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="topup-sheet">
            <div className="topup-intro">
              <span className="topup-intro-mark" aria-hidden="true"><Plus size={17} strokeWidth={2.4} /></span>
              <button
                type="button"
                className="topup-close"
                aria-label={zh ? "关闭" : "Close"}
                data-cursor="hover"
                onClick={() => setOpen(false)}
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
              <h2 className="topup-title">{zh ? "为钱包充值" : "Add to your wallet"}</h2>
              <p className="topup-sub">
                {zh ? "选择适合的金额，支付后额度直接进入钱包。" : "Choose an amount. Your credit is added after payment."}
              </p>
            </div>

            <div className="topup-body">
              <div className="topup-label-row">
                <span>{zh ? "选择充值金额" : "Choose an amount"}</span>
                <span className="topup-hint">{zh ? "人民币结算" : "Billed in CNY"}</span>
              </div>

              <div className="topup-grid">
                {QUICK_AMOUNTS.map((item) => {
                  const on = !custom.trim() && amount === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      className={cn("topup-option", on && "is-on")}
                      aria-pressed={on}
                      data-cursor="hover"
                      onClick={() => {
                        setAmount(item);
                        setCustom("");
                      }}
                    >
                      <span className="topup-option-meta">
                        <span>{zh ? "充值额度" : "Wallet credit"}</span>
                        {item === 200 ? <span className="topup-badge">{zh ? "常用" : "Popular"}</span> : null}
                      </span>
                      <span className="topup-option-amount">
                        <em>¥</em>
                        {item}
                      </span>
                      <span className="topup-radio" aria-hidden="true">{on ? <Check size={13} strokeWidth={3} /> : null}</span>
                    </button>
                  );
                })}
              </div>

              <label className={cn("topup-custom", custom.trim() && "is-on")}>
                <span className="topup-label-row">
                  <span>{zh ? "自定义金额" : "Custom amount"}</span>
                  <span className="topup-hint">
                    {zh ? `最低 ¥${MIN_AMOUNT}` : `Min ¥${MIN_AMOUNT}`}
                  </span>
                </span>
                <span className="topup-custom-field">
                  <em>¥</em>
                  <input
                    type="number"
                    min={MIN_AMOUNT}
                    inputMode="numeric"
                    placeholder={`${MIN_AMOUNT}`}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                  />
                </span>
              </label>

              <div className="topup-total">
                <div className="topup-total-row">
                  <span>{zh ? "当前余额" : "Current balance"}</span>
                  <span>{balance == null ? "—" : formatYuan(balance)}</span>
                </div>
                <div className="topup-total-row is-payable">
                  <span>{zh ? "实际支付" : "You pay"}</span>
                  <strong>{valid ? formatYuan(active * 100) : "—"}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-acid topup-pay"
              data-cursor="hover"
              disabled={!valid || busy}
              onClick={submit}
            >
              {busy ? (zh ? "处理中…" : "Processing…") : zh ? `支付 ${valid ? formatYuan(active * 100) : "—"}` : `Pay ${valid ? formatYuan(active * 100) : "—"}`}
              <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <p className="topup-secure">
              {zh ? "加密传输 · 支付后实时到账" : "Encrypted in transit · Credited instantly"}
            </p>
          </div>
        </div>,
        document.body,
      ) : null}
    </section>
  );
}
