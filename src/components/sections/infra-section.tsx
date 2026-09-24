import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Info } from "lucide-react";
import { FoytonBrand } from "@/components/layout/foyton-brand";
import { useLanguage } from "@/lib/language";

/** Where the social icons point; X goes to the official account. */
const SOCIAL_URLS: Record<(typeof SOCIALS)[number]["title"], string> = {
  X: "https://x.com/FUYITONG111",
  Discord: "https://discord.com",
  LinkedIn: "https://linkedin.com",
  YouTube: "https://youtube.com",
};

const STATS = [
  { value: "99.99%", label: { zh: "可用率", en: "Uptime" } },
  { value: "120ms", label: { zh: "路由延迟", en: "Routing" } },
  { value: "24/7", label: { zh: "持续服务", en: "Coverage" } },
] as const;

const COLUMNS = [
  {
    title: { zh: "产品", en: "Product" },
    items: [
      { label: { zh: "模型列表", en: "Model list" }, to: "/models" as const },
      { label: { zh: "控制台", en: "Console" }, to: "/console" as const },
      { label: { zh: "服务保障", en: "Service levels" }, to: null },
    ],
  },
  {
    title: { zh: "资源", en: "Resources" },
    items: [
      { label: { zh: "接入指南", en: "Quick start" }, to: null },
      { label: { zh: "API 文档", en: "API reference" }, to: null },
      { label: { zh: "状态页", en: "Status" }, to: null },
    ],
  },
  {
    title: { zh: "公司", en: "Company" },
    items: [
      { label: { zh: "关于我们", en: "About" }, to: null },
      { label: { zh: "博客", en: "Blog" }, to: null },
      { label: { zh: "联系我们", en: "Contact" }, to: "/contact" as const },
    ],
  },
] as const;

const SOCIALS = [
  {
    title: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    title: "Discord",
    path: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
  },
  {
    title: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z",
  },
  {
    title: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
] as const;

export function InfraSection() {
  const root = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const zh = language === "zh";

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelector(".infra-card"),
      { y: 34, opacity: 0, filter: "blur(10px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      },
    );
    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="infrastructure" className="infra" ref={root}>
      <div className="infra-card">
        <div className="infra-brand">
          <div className="infra-brand-top">
            <FoytonBrand />
          </div>

          <div className="infra-brand-mid">
            <p className="infra-brand-kicker">{zh ? "生产级基础设施" : "Production infrastructure"}</p>
            <p className="infra-brand-slogan">
              {zh ? "为生产环境稳定运行。" : "Built to stay up in production."}
            </p>
            <ul className="infra-brand-stats">
              {STATS.map((stat) => (
                <li key={stat.value}>
                  <span className="infra-stat-value">{stat.value}</span>
                  <span className="infra-stat-label">{zh ? stat.label.zh : stat.label.en}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="infra-brand-foot">
            <Link to="/contact" className="infra-contact" data-cursor="hover">
              <Info size={14} strokeWidth={2} aria-hidden="true" />
              {zh ? "联系我们" : "Contact us"}
            </Link>
            <div className="infra-social">
              {SOCIALS.map((social) => (
                <a
                  key={social.title}
                  href={SOCIAL_URLS[social.title]}
                  target="_blank"
                  rel="noreferrer"
                  title={social.title}
                  data-cursor="hover"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="infra-links">
          <div className="infra-cols">
            {COLUMNS.map((column) => (
              <div key={column.title.en}>
                <p className="infra-col-title">{zh ? column.title.zh : column.title.en}</p>
                <ul>
                  {column.items.map((item) => (
                    <li key={item.label.en}>
                      {item.to ? (
                        <Link to={item.to} data-cursor="hover">
                          {zh ? item.label.zh : item.label.en}
                        </Link>
                      ) : (
                        <span>{zh ? item.label.zh : item.label.en}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="infra-stamp" aria-hidden="true">
            <span className="infra-stamp-ring">
              <span className="infra-stamp-arc">★ FOYTON API ★</span>
              <svg className="infra-stamp-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
              </svg>
              <span className="infra-stamp-ribbon">{zh ? "生产就绪" : "Production ready"}</span>
            </span>
          </div>

          <p className="infra-copy">
            {zh ? "© 2026 Foyton API. 保留所有权利。" : "© 2026 Foyton API. All rights reserved."}
          </p>
        </div>
      </div>
    </section>
  );
}
