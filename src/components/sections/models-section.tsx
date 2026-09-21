import { useState } from "react";
import { MODELS } from "@/lib/models";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";
import { ModelLogo } from "@/components/models/model-logo";

export function ModelsSection() {
  const [active, setActive] = useState<string | null>(null);
  const { language } = useLanguage();
  const zh = language === "zh";

  return (
    <section id="models" className="models">
      <div className="models-copy">
        <p className="section-kicker">{zh ? "模型能力" : "Section 02"}</p>
        <h2 className="section-title">
          {zh ? "全球领先模型。" : "The world’s best models."}
          <br />
          {zh ? "一个统一入口。" : "One endpoint."}
        </h2>
      </div>
      <ol className="model-list">
        {MODELS.filter((model) => model.category !== "IMAGE" && model.category !== "AUDIO").map(
          (model) => {
          const open = active === model.name;
          return (
            <li key={model.name} className={cn("model-row", open && "is-open")}>
              <button
                type="button"
                data-cursor="hover"
                onMouseEnter={() => setActive(model.name)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(model.name)}
                onBlur={() => setActive(null)}
              >
                <span className="model-name">
                  <span className="model-logo" aria-hidden="true">
                    <ModelLogo name={model.name} />
                  </span>
                  {model.name}
                </span>
                <span className={cn("model-meta", open && "is-visible")}>
                  <em>{model.full}</em>
                  <span>{model.latency}</span>
                  <span>{model.price}</span>
                  <span>{model.context}</span>
                  <span className="model-status">
                    <i />
                    {zh && model.status === "Operational" ? "运行正常" : model.status}
                  </span>
                </span>
              </button>
            </li>
          );
          },
        )}
      </ol>
    </section>
  );
}
