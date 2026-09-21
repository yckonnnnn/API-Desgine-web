import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/language";

const STATS = [
  { value: "99.99%", label: "Uptime" },
  { value: "120ms", label: "Routing" },
  { value: "24/7", label: "Infrastructure" },
];

export function InfraSection() {
  const root = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const zh = language === "zh";

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const nums = el.querySelectorAll(".stat-value");
    gsap.fromTo(
      nums,
      { y: 28, opacity: 0, filter: "blur(8px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.15,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 72%",
        },
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
      <p className="section-kicker">{zh ? "生产级基础设施" : "Section 03"}</p>
      <h2 className="section-title infra-title">
        {zh ? "为生产环境" : "Built for"}
        <br />
        {zh ? "稳定运行。" : "production."}
      </h2>
      <ul className="stat-list">
        {STATS.map((stat) => (
          <li key={stat.label}>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{zh ? ({ Uptime: "可用率", Routing: "路由延迟", Infrastructure: "持续服务" }[stat.label] ?? stat.label) : stat.label}</span>
          </li>
        ))}
      </ul>
      <p className="infra-foot">{zh ? "Foyton API 为每一次调用提供路由、均衡和监控。" : "FYT routes, balances, and observes every call."}</p>
    </section>
  );
}
