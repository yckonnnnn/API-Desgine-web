import { useEffect, useState } from "react";
import { ModelLogo } from "@/components/models/model-logo";
import { MODELS, type ModelInfo } from "@/lib/models";
import { useLanguage } from "@/lib/language";
import { usePrefersReducedMotion } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/**
 * The models the hero panel routes through, one per provider, so a reader sees
 * the breadth of the gateway rather than six badges from the same vendor.
 */
const ROUTE_IDS = [
  "gpt-6-astra",
  "claude-opus-5",
  "deepseek-v4-pro",
  "Qwen3.8-27B",
  "glm-5.3",
  "kimi-k3",
  "grok-4.6",
];

/** How long one provider holds the panel before the next takes over. */
const HOLD_MS = 2600;

const ROUTED: ModelInfo[] = (ROUTE_IDS.map((id) => MODELS.find((model) => model.id === id)).filter(
  Boolean,
) as ModelInfo[]).slice(0, 7);

/**
 * A request on its way through the gateway, cycling through the providers it
 * could land on.
 *
 * This is the docs hero's one piece of product proof: the page otherwise opens
 * with type alone, which left the title floating against empty space. The model
 * names and latencies come from the real model list, so the panel cannot drift
 * from what the console shows.
 *
 * Announcement-wise the whole thing is one labelled image — the cycling rows
 * would otherwise re-announce themselves every few seconds.
 */
export function DocsRouteVisual() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || ROUTED.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % ROUTED.length),
      HOLD_MS,
    );
    return () => window.clearInterval(timer);
  }, [reduced]);

  if (ROUTED.length === 0) return null;

  const active = ROUTED[Math.min(index, ROUTED.length - 1)];

  return (
    <div
      className="doc-route"
      role="img"
      aria-label={
        zh
          ? `一个端点路由到 ${ROUTED.length} 家模型提供商，包括 ${ROUTED.map((model) => model.provider).join("、")}。`
          : `One endpoint routing to ${ROUTED.length} model providers, including ${ROUTED.map((model) => model.provider).join(", ")}.`
      }
    >
      <span className="doc-route-sweep" aria-hidden="true" />

      <header className="doc-route-head">
        <span className="doc-route-live">
          <i aria-hidden="true" />
          {zh ? "实时路由" : "Live routing"}
        </span>
        <span className="doc-route-proto">OpenAI compatible</span>
      </header>

      <p className="doc-route-req">
        <span className="doc-route-method">POST</span>
        /v1/chat/completions
      </p>

      <div className="doc-route-targets">
        {ROUTED.map((model, position) => (
          <div
            key={model.id}
            className={cn("doc-route-target", position === index && "is-on")}
          >
            <span className="doc-route-badge">
              <ModelLogo name={model.provider} size={22} />
            </span>
            <span className="doc-route-names">
              <span className="doc-route-model">{model.id}</span>
              <span className="doc-route-vendor">{model.provider}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="doc-route-status">
        <span className="doc-route-ok">200 OK</span>
        <span className="doc-route-sep" aria-hidden="true" />
        <span>{active.latency}</span>
        <span className="doc-route-sep" aria-hidden="true" />
        <span>stream</span>
      </p>

      <div className="doc-route-rail">
        <span className="doc-route-rail-label">{zh ? "已接入" : "Routed"}</span>
        <ul className="doc-route-marks">
          {ROUTED.map((model, position) => (
            <li
              key={model.id}
              className={cn("doc-route-mark", position === index && "is-on")}
            >
              <ModelLogo name={model.provider} size={18} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
