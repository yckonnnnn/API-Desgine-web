import { Link } from "@tanstack/react-router";
import { StartCta } from "@/components/layout/auth-slot";
import { ApiPanel } from "./api-panel";
import { useLanguage } from "@/lib/language";

export function Hero() {
  const { language } = useLanguage();
  const zh = language === "zh";
  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <p className="hero-kicker reveal delay-1">
          <span>FYT API</span>
          <span className="kicker-dot" aria-hidden="true" />
          <span>{zh ? "AI 基础设施" : "AI Infrastructure"}</span>
        </p>
        <h1 className={`display-title${zh ? " display-title-zh" : ""}`}>
          <span className="line-mask">
            <span className="line-inner delay-2">{zh ? "一个接口。" : "ONE API."}</span>
          </span>
          <span className="line-mask">
            <span className="line-inner delay-3">{zh ? "所有智能。" : "EVERY INTELLIGENCE."}</span>
          </span>
        </h1>
        <p className="hero-lede reveal delay-4">
          {zh ? "连接全球领先的 AI 模型" : "Connect to the world’s leading AI models"}
          <br />
          {zh ? "只需一个统一 API。" : "through one unified API."}
        </p>
        <div className="hero-cta reveal delay-5">
          <StartCta className="btn-ink" language={language} />
          <Link to="/models" className="btn-ghost" data-cursor="hover">
            {zh ? "浏览模型" : "Explore models"}
          </Link>
        </div>
      </div>
      <ApiPanel />
      <div className="scroll-hint reveal delay-6">
        <span>{zh ? "向下滚动" : "Scroll"}</span>
        <i />
      </div>
    </section>
  );
}
