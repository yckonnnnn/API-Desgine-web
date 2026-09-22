import { Layers, Sparkles, Zap } from "lucide-react";

/**
 * The three prepaid plans.
 *
 * One definition because two surfaces sell them — the marketing page's credit
 * packs and the wallet's own package row — and the marketing page links into
 * the wallet by `id` (`/console/wallet?plan=max`), which the wallet resolves
 * against this list. Duplicating the array would make every rename or reprice a
 * silently broken link, so the id, the amount and the copy live here once.
 *
 * `tone` is the wallet's card treatment: `light` is a plain white card, `accent`
 * is the lime one, `dark` is the inverse card that closes the row. Exactly one
 * plan is `accent`, which is also what makes it the featured one on the
 * marketing side — see `isFeaturedPlan`.
 */
export const PLANS = [
  {
    id: "pro",
    name: "Pro",
    /** Whole yuan. This is the amount charged, and the credit granted. */
    amount: 100,
    tone: "light",
    badge: null,
    icon: Zap,
    desc: { zh: "个人项目与轻量开发", en: "Side projects and light development" },
    perks: [
      { zh: "全部模型可用", en: "Every model included" },
      { zh: "标准路由通道", en: "Standard routing" },
      { zh: "用量与成本明细", en: "Usage and cost breakdown" },
    ],
  },
  {
    id: "max",
    name: "Max",
    amount: 200,
    tone: "accent",
    badge: { zh: "最受欢迎", en: "Most popular" },
    icon: Layers,
    desc: { zh: "日常产品开发", en: "Day-to-day product work" },
    perks: [
      { zh: "包含 Pro 全部权益", en: "Everything in Pro" },
      { zh: "优先路由通道", en: "Priority routing" },
      { zh: "更高的并发额度", en: "Higher concurrency" },
      { zh: "邮件支持", en: "Email support" },
    ],
  },
  {
    id: "business",
    name: "Business",
    amount: 500,
    tone: "dark",
    badge: null,
    icon: Sparkles,
    desc: { zh: "团队与高频调用", en: "Teams and heavy traffic" },
    perks: [
      { zh: "包含 Max 全部权益", en: "Everything in Max" },
      { zh: "独立通道与更高并发", en: "Dedicated lanes, higher concurrency" },
      { zh: "多密钥与团队管理", en: "Multiple keys and team management" },
      { zh: "优先技术支持", en: "Priority technical support" },
    ],
  },
] as const;

export type Plan = (typeof PLANS)[number];
export type PlanId = Plan["id"];

export function isFeaturedPlan(plan: Plan) {
  return plan.tone === "accent";
}

/**
 * Resolve a plan from a URL search param. Returns null for anything unknown —
 * a hand-edited `?plan=enterprise` opens the wallet with no checkout rather
 * than throwing, which is the behaviour you want from a link a user can type.
 */
export function findPlan(id: string | undefined | null): Plan | null {
  return PLANS.find((plan) => plan.id === id) ?? null;
}

/** Where a signed-in buyer lands for a given plan. */
export function planCheckoutHref(id: PlanId) {
  return `/console/wallet?plan=${id}`;
}
