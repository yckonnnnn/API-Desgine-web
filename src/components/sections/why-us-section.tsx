import { useRef } from "react";
import { ArrowRight, Check, KeyRound, PlugZap, Receipt, Signal, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLanguage } from "@/lib/language";
import { PLANS, isFeaturedPlan, planCheckoutHref, type Plan } from "@/lib/plans";
import { formatYuan } from "@/lib/format";

/**
 * Value props, not a feature list: each row names the thing you stop doing.
 *
 * These were filled bento tiles, which read as the ecosystem grid again one
 * screen up and — worse — laid an opaque white sheet over the page exactly
 * where the pearl is choreographed to pass behind. They're now hairline-ruled
 * rows with no fill, so the section is structured by rules instead of boxes and
 * the pearl stays visible through it.
 */
const REASONS = [
  {
    id: "keys",
    icon: KeyRound,
    title: { zh: "一个密钥，全部模型", en: "One key, every model" },
    desc: {
      zh: "一个账号、一份额度，覆盖 GPT、Claude、Gemini 与国产头部模型，不必再维护多套 SDK 与充值渠道。",
      en: "A single account and balance across GPT, Claude, Gemini and China's leading models — no separate SDKs or top-ups per vendor.",
    },
  },
  {
    id: "migrate",
    icon: PlugZap,
    title: { zh: "改一行就能迁移", en: "Migrate with one line" },
    desc: {
      zh: "兼容 OpenAI 协议，现有代码只需替换 base_url。",
      en: "OpenAI-compatible, so existing code only swaps its base_url.",
    },
  },
  {
    id: "usage",
    icon: Wallet,
    title: { zh: "按量付费，没有月费", en: "Pay as you go" },
    desc: {
      zh: "用多少扣多少，余额与账单实时可见，随时充值。",
      en: "Charged by actual usage, with a live balance and statement you can top up anytime.",
    },
  },
  {
    id: "ledger",
    icon: Receipt,
    title: { zh: "每个 token 都有账", en: "Every token accounted" },
    desc: {
      zh: "逐次记录模型、延迟与用量，方便对账与成本分摊。",
      en: "Model, latency and usage recorded per call, ready for auditing and cost allocation.",
    },
  },
  {
    id: "latency",
    icon: Signal,
    title: { zh: "国内直连", en: "Direct from China" },
    desc: {
      zh: "无需海外网络环境，首字延迟稳定在 380ms 以内。",
      en: "No overseas network required, with time-to-first-token under 380ms.",
    },
  },
] as const;

/** Total spread of the tilt: the card leans ±8° across its full width. */
const TILT_DEG = 16;

/**
 * One card per plan, tilted toward the pointer.
 *
 * The tilt is written straight to CSS custom properties on the element rather
 * than held in React state: a pointermove through setState would re-render the
 * whole section every frame, and the transform has to follow the cursor with no
 * transition to feel attached to it. The `is-tilting` class is what suspends
 * that transition for the duration of the hover, so the return trip still eases.
 *
 * The button is a link, not a form: a signed-in buyer is sent to the wallet with
 * the plan it names, which opens that plan's checkout on arrival; a signed-out
 * one is sent to sign in carrying the same destination, so the choice survives
 * the detour.
 */
function TierCard({ plan, zh, signedIn }: { plan: Plan; zh: boolean; signedIn: boolean }) {
  const inner = useRef<HTMLDivElement>(null);
  const featured = isFeaturedPlan(plan);
  const Icon = plan.icon;

  const track = (event: React.PointerEvent<HTMLElement>) => {
    const el = inner.current;
    // Touch pointers fire during a scroll drag, where a tilt is just noise.
    if (!el || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--tilt-x", `${((0.5 - y) * TILT_DEG).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${((x - 0.5) * TILT_DEG).toFixed(2)}deg`);
    el.style.setProperty("--tilt-mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--tilt-my", `${(y * 100).toFixed(1)}%`);
  };

  const enter = () => inner.current?.classList.add("is-tilting");

  const leave = () => {
    const el = inner.current;
    if (!el) return;
    el.classList.remove("is-tilting");
    for (const prop of ["--tilt-x", "--tilt-y", "--tilt-mx", "--tilt-my"]) {
      el.style.removeProperty(prop);
    }
  };

  return (
    <article
      className={`tier-card${featured ? " is-featured" : ""}`}
      onPointerMove={track}
      onPointerEnter={enter}
      onPointerLeave={leave}
    >
      <div className="tier-inner" ref={inner}>
        {plan.badge ? (
          <span className="tier-badge">{zh ? plan.badge.zh : plan.badge.en}</span>
        ) : null}

        <span className="tier-icon" aria-hidden="true">
          <Icon size={19} strokeWidth={1.7} />
        </span>

        <h3 className="tier-name">{plan.name}</h3>
        <p className="tier-tagline">{zh ? plan.desc.zh : plan.desc.en}</p>

        <p className="tier-price">
          <span className="tier-price-amount">{formatYuan(plan.amount * 100)}</span>
          <span className="tier-price-unit">{zh ? "套餐额度" : "credit"}</span>
        </p>

        <ul className="tier-features">
          {plan.perks.map((perk) => (
            <li key={perk.en}>
              <Check size={14} strokeWidth={2.4} aria-hidden="true" />
              {zh ? perk.zh : perk.en}
            </li>
          ))}
        </ul>

        <p className="tier-note">
          <Check size={14} strokeWidth={2.4} aria-hidden="true" />
          {zh ? "支付后即时到账" : "Credited instantly"}
        </p>

        <Link
          to={signedIn ? "/console/wallet" : "/login"}
          search={signedIn ? { plan: plan.id } : { redirect: planCheckoutHref(plan.id) }}
          className="tier-buy"
          data-cursor="hover"
        >
          {zh ? "立即订阅" : "Subscribe"}
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function WhyUsSection() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const { user } = useCurrentUserState();

  return (
    <section id="why-us" className="why">
      <header className="why-head">
        <p className="section-kicker">{zh ? "为什么选择我们" : "Why us"}</p>
        <h2 className="section-title">
          {zh ? "一个接口，" : "One endpoint."}
          <br />
          {zh ? "省掉七套对接。" : "Seven integrations you skip."}
        </h2>
        <p className="why-lede">
          {zh
            ? "不用维护多个账号，不用适配多套 SDK，也不用自己写故障转移与计费。"
            : "No separate accounts, no per-vendor SDKs, and no routing or billing layer to build yourself."}
        </p>
      </header>

      <div className="why-list">
        {REASONS.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <article key={reason.id} className="why-row" data-cursor="hover">
              <span className="why-row-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="why-row-title">
                <span className="why-row-icon" aria-hidden="true">
                  <Icon size={17} strokeWidth={1.7} />
                </span>
                {zh ? reason.title.zh : reason.title.en}
              </h3>
              <p className="why-row-desc">{zh ? reason.desc.zh : reason.desc.en}</p>
            </article>
          );
        })}
      </div>

      {/*
        Prepaid tiers. The buttons are links rather than a purchase form — this
        section only routes to the wallet, where the actual payment UI lives.
      */}
      <div className="tier-head">
        <p className="section-kicker">{zh ? "充值套餐" : "Credit packs"}</p>
        <p className="tier-lede">
          {zh ? "一次性付款，额度直接充入钱包，用完再充。" : "Paid once, credited straight to your wallet. Top up again when it runs low."}
        </p>
      </div>

      <div className="tier-grid">
        {PLANS.map((plan) => (
          <TierCard key={plan.id} plan={plan} zh={zh} signedIn={user !== null} />
        ))}
      </div>
    </section>
  );
}
