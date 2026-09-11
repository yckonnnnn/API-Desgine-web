import { ApiPanel } from "./api-panel";

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <p className="hero-kicker reveal delay-1">
          <span>FYT API</span>
          <span className="kicker-dot" aria-hidden="true" />
          <span>AI Infrastructure</span>
        </p>
        <h1 className="display-title">
          <span className="line-mask">
            <span className="line-inner delay-2">ONE API.</span>
          </span>
          <span className="line-mask">
            <span className="line-inner delay-3">EVERY INTELLIGENCE.</span>
          </span>
        </h1>
        <p className="hero-lede reveal delay-4">
          Connect to the world’s leading AI models
          <br />
          through one unified API.
        </p>
        <div className="hero-cta reveal delay-5">
          <a href="#models" className="btn-ink" data-cursor="hover">
            Start building
          </a>
          <a href="#models" className="btn-ghost" data-cursor="hover">
            Explore models
          </a>
        </div>
      </div>
      <ApiPanel />
      <div className="scroll-hint reveal delay-6">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
