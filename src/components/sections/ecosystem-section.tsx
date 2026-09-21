import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import Claude from "@lobehub/icons/es/Claude";
import DeepSeek from "@lobehub/icons/es/DeepSeek";
import Gemini from "@lobehub/icons/es/Gemini";
import Kimi from "@lobehub/icons/es/Kimi";
import OpenAI from "@lobehub/icons/es/OpenAI";
import Qwen from "@lobehub/icons/es/Qwen";
import { useLanguage } from "@/lib/language";

function GlmMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="#4f6ef7">
        <circle cx="12" cy="3.5" r="1.6" />
        <circle cx="17.7" cy="5.8" r="1.6" />
        <circle cx="20.2" cy="11.5" r="1.6" />
        <circle cx="17.7" cy="17.2" r="1.6" />
        <circle cx="12" cy="20.5" r="1.6" />
        <circle cx="6.3" cy="17.2" r="1.6" />
        <circle cx="3.8" cy="11.5" r="1.6" />
        <circle cx="6.3" cy="5.8" r="1.6" />
        <circle cx="12" cy="12" r="2.3" />
      </g>
    </svg>
  );
}

const PROVIDERS = [
  {
    name: "OpenAI",
    desc: { zh: "旗舰前沿模型", en: "Frontier flagship models" },
    icon: <OpenAI size={26} />,
  },
  {
    name: "Anthropic",
    desc: { zh: "深度推理与代码", en: "Deep reasoning and coding" },
    icon: <Claude.Color size={26} />,
  },
  {
    name: "Google",
    desc: { zh: "多模态与长上下文", en: "Multimodal and long context" },
    icon: <Gemini.Color size={26} />,
  },
  {
    name: "DeepSeek",
    desc: { zh: "极致性价比", en: "Exceptional cost-performance" },
    icon: <DeepSeek.Color size={26} />,
  },
  {
    name: "Kimi",
    desc: { zh: "长文本专家", en: "Long-context specialist" },
    icon: <Kimi size={26} />,
  },
  {
    name: "GLM",
    desc: { zh: "开源国产生态", en: "Open-source model ecosystem" },
    icon: <GlmMark size={26} />,
  },
  {
    name: "Qwen",
    desc: { zh: "通义千问系列", en: "The Qwen model family" },
    icon: <Qwen.Color size={26} />,
  },
] as const;

const STATS = [
  { value: "100%", label: { zh: "原生协议兼容", en: "Native protocol compatibility" } },
  { value: "< 380ms", label: { zh: "首字延迟", en: "Time to first token" } },
  { value: "99.99%", label: { zh: "企业级 SLA", en: "Enterprise SLA" } },
  { value: "1M", label: { zh: "上下文窗口", en: "Context window" } },
] as const;

export function EcosystemSection() {
  const { language } = useLanguage();
  const zh = language === "zh";

  return (
    <section id="ecosystem" className="eco">
      <header className="eco-head">
        <p className="section-kicker">
          <span className="kicker-rule" />
          {zh ? "模型生态" : "Model ecosystem"}
          <span className="kicker-rule" />
        </p>
        <h2 className="section-title">
          {zh ? "一个 API，接入主流大模型" : "One API. Every leading model."}
        </h2>
        <p className="eco-lede">
          {zh
            ? "统一接口协议，无缝切换 OpenAI、Anthropic、Google 与国产头部模型，无需改动任何现有代码。"
            : "One protocol across OpenAI, Anthropic, Google and China's leading model houses — without changing a line of your existing code."}
        </p>
      </header>

      <div className="eco-grid">
        {PROVIDERS.map((provider) => (
          <article key={provider.name} className="eco-card">
            <span className="eco-icon" aria-hidden="true">
              {provider.icon}
            </span>
            <h3>{provider.name}</h3>
            <p>{zh ? provider.desc.zh : provider.desc.en}</p>
          </article>
        ))}
        <Link to="/models" className="eco-card eco-more" data-cursor="hover">
          <span className="eco-icon eco-icon-ghost" aria-hidden="true">
            <ArrowRight size={18} strokeWidth={1.75} />
          </span>
          <h3>{zh ? "查看全部模型" : "View all models"}</h3>
          <p>{zh ? "进入模型广场" : "Open the model square"}</p>
        </Link>
      </div>

      <ul className="eco-stats">
        {STATS.map((stat) => (
          <li key={stat.value} className="eco-stat">
            <span className="eco-stat-value">{stat.value}</span>
            <span className="eco-stat-label">{zh ? stat.label.zh : stat.label.en}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
