import { useState } from "react";
import { MODELS } from "@/lib/models";
import { cn } from "@/lib/utils";

export function ModelsSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="models" className="models">
      <div className="models-copy">
        <p className="section-kicker">Section 02</p>
        <h2 className="section-title">
          The world’s best models.
          <br />
          One endpoint.
        </h2>
      </div>
      <ol className="model-list">
        {MODELS.map((model) => {
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
                <span className="model-name">{model.name}</span>
                <span className={cn("model-meta", open && "is-visible")}>
                  <em>{model.full}</em>
                  <span>{model.latency}</span>
                  <span>{model.price}</span>
                  <span>{model.context}</span>
                  <span className="model-status">
                    <i />
                    {model.status}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
