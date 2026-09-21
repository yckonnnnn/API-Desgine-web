import { useEffect, useRef } from "react";
import { LiquidGlass } from "@/components/glass/liquid-glass";
import { scene } from "@/lib/scene-state";
import { useLanguage } from "@/lib/language";

export function ApiPanel() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const loop = () => {
      if (!scene.reduced && !scene.mobile) {
        const x = scene.mouseX * 2;
        const y = scene.mouseY * -2;
        el.style.transform = `perspective(1400px) rotateY(${-8 + x}deg) rotateX(${4 + y}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="api-panel-rig">
      <LiquidGlass className="api-panel" data-cursor="hover">
        <div className="api-row">
          <span className="api-method">POST</span>
          <span className="api-path">/v1/chat/completions</span>
        </div>
        <div className="api-grid">
          <span>{zh ? "模型" : "model"}</span>
          <strong>gpt-5</strong>
          <span>{zh ? "状态" : "status"}</span>
          <strong className="api-ok">
            <i />
            200 OK
          </strong>
          <span>{zh ? "延迟" : "latency"}</span>
          <strong>128 ms</strong>
        </div>
      </LiquidGlass>
    </div>
  );
}
