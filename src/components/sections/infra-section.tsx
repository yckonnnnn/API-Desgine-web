import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS = [
  { value: "99.99%", label: "Uptime" },
  { value: "120ms", label: "Routing" },
  { value: "24/7", label: "Infrastructure" },
];

export function InfraSection() {
  const root = useRef<HTMLElement>(null);

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
      <p className="section-kicker">Section 03</p>
      <h2 className="section-title infra-title">
        Built for
        <br />
        production.
      </h2>
      <ul className="stat-list">
        {STATS.map((stat) => (
          <li key={stat.label}>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </li>
        ))}
      </ul>
      <p className="infra-foot">FYT routes, balances, and observes every call.</p>
    </section>
  );
}
