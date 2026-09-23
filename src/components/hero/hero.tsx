import { Link } from "@tanstack/react-router";
import { StartCta } from "@/components/layout/auth-slot";
import { useLanguage } from "@/lib/language";

export function Hero() {
  const { language } = useLanguage();
  const zh = language === "zh";
  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <p className="hero-kicker reveal delay-1">
          <span>Foyton API</span>
          <span className="kicker-dot" aria-hidden="true" />
          <span>{zh ? "大模型统一入口" : "One gateway for AI models"}</span>
        </p>
        <h1 className={`display-title${zh ? " display-title-zh" : ""}`}>
          <span className="line-mask">
            <span className="line-inner delay-2">{zh ? <><span className="hero-agent-word">Agent</span> 接入</> : "AGENT ACCESS"}</span>
          </span>
          <span className="line-mask">
            <span className="line-inner delay-3 hero-title-secondary">{zh ? "大模型统一入口" : "ONE GATEWAY FOR AI."}</span>
          </span>
        </h1>
        <p className="hero-lede reveal delay-4">
          {zh
            ? "一套 API 接入主流大模型，让 Agent 快速连接所需智能。"
            : "Connect leading AI models through one API, and switch freely as your needs evolve."}
        </p>
        <div className="hero-cta reveal delay-5">
          <StartCta className="btn-ink" language={language} />
          <Link to="/models" className="btn-ghost" data-cursor="hover">
            {zh ? "浏览模型" : "Explore models"}
          </Link>
        </div>
      </div>
      <div className="scroll-hint reveal delay-6">
        <span>{zh ? "向下滚动" : "Scroll"}</span>
        <i />
      </div>
    </section>
  );
}
