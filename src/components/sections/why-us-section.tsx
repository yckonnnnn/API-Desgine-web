import type { PointerEvent } from "react";
import { ArrowRight, Gauge, KeyRound, PlugZap, Receipt, Signal, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLanguage } from "@/lib/language";

/**
 * Value props, not a feature list: each tile names the thing you stop doing.
 * The bento is asymmetric on purpose — a uniform grid here would read as the
 * ecosystem block again, one screen up.
 *
 * `span` maps onto the 12-column grid: a 7/5 first row, then three 4s.
 */
const REASONS = [
  {
    id: "keys",
    icon: KeyRound,
    span: 7,
    title: { zh: "一个密钥，全部模型", en: "One key, every model" },
    desc: {
      zh: "一个账号、一份额度，覆盖 GPT、Claude、Gemini 与国产头部模型，不必再维护多套 SDK 与充值渠道。",
      en: "A single account and balance across GPT, Claude, Gemini and China's leading models — no separate SDKs or top-ups per vendor.",
    },
  },
  {
    id: "migrate",
    icon: PlugZap,
    span: 5,
    title: { zh: "改一行就能迁移", en: "Migrate with one line" },
    desc: {
      zh: "兼容 OpenAI 协议，现有代码只需替换 base_url。",
      en: "OpenAI-compatible, so existing code only swaps its base_url.",
    },
  },
  {
    id: "usage",
    icon: Wallet,
    span: 4,
    title: { zh: "按量付费，没有月费", en: "Pay as you go" },
    desc: {
      zh: "用多少扣多少，余额与账单实时可见，随时充值。",
      en: "Charged by actual usage, with a live balance and statement you can top up anytime.",
    },
  },
  {
    id: "ledger",
    icon: Receipt,
    span: 4,
    title: { zh: "每个 token 都有账", en: "Every token accounted" },
    desc: {
      zh: "逐次记录模型、延迟与用量，方便对账与成本分摊。",
      en: "Model, latency and usage recorded per call, ready for auditing and cost allocation.",
    },
  },
  {
    id: "latency",
    icon: Signal,
    span: 4,
    title: { zh: "国内直连", en: "Direct from China" },
    desc: {
      zh: "无需海外网络环境，首字延迟稳定在 380ms 以内。",
      en: "No overseas network required, with time-to-first-token under 380ms.",
    },
  },
] as const;

const TOP_UPS = [50, 100, 200, 500] as const;

/** Feeds the spotlight gradient its origin, so the highlight tracks the cursor. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

export function WhyUsSection() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const { user } = useCurrentUserState();

  // Same convention as the navbar's StartCta: signed-in buyers land on the
  // wallet, everyone else is sent to sign in first.
  const buyTo = user ? "/console/wallet" : "/login";

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

      <div className="why-grid">
        {REASONS.map((reason) => {
          const Icon = reason.icon;
          return (
            <article
              key={reason.id}
              className={`why-tile why-span-${reason.span}`}
              onPointerMove={trackPointer}
            >
              <span className="why-icon" aria-hidden="true">
                <Icon size={19} strokeWidth={1.7} />
              </span>
              <h3>{zh ? reason.title.zh : reason.title.en}</h3>
              <p>{zh ? reason.desc.zh : reason.desc.en}</p>
            </article>
          );
        })}
      </div>

      {/*
        Top-up controls. The amounts are links rather than a purchase form —
        this section only routes to the wallet, where the actual payment UI
        lives and will be redesigned.
      */}
      <div className="why-cta">
        <div className="why-cta-copy">
          <p className="why-cta-title">{zh ? "按量付费，随时充值" : "Pay as you go, top up anytime"}</p>
          <p className="why-cta-note">
            {zh ? "余额即时到账，按实际调用扣费。" : "Funds land instantly and are drawn down by real usage."}
          </p>
        </div>

        <div className="why-cta-actions">
          <ul className="why-amounts">
            {TOP_UPS.map((amount) => (
              <li key={amount}>
                <Link to={buyTo} data-cursor="hover" aria-label={zh ? `充值 ${amount} 元` : `Top up ¥${amount}`}>
                  ¥{amount}
                </Link>
              </li>
            ))}
          </ul>
          <Link to={buyTo} className="why-buy btn-ink" data-cursor="hover">
            <Gauge size={15} strokeWidth={1.9} aria-hidden="true" />
            {zh ? "立即充值" : "Add funds"}
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
