import { useState } from "react";
import { LiquidGlass } from "@/components/glass/liquid-glass";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

const SAMPLES = [
  {
    model: "gpt-5",
    label: "GPT-5",
    reply: "One endpoint. Every intelligence.",
  },
  {
    model: "claude-4",
    label: "Claude 4",
    reply: "A single route. Every origin.",
  },
  {
    model: "grok-3",
    label: "Grok 3",
    reply: "The moon, on demand.",
  },
] as const;

export function PlaygroundSection() {
  const [active, setActive] = useState<(typeof SAMPLES)[number]>(SAMPLES[0]);
  const { language } = useLanguage();
  const zh = language === "zh";

  return (
    <section id="playground" className="playground">
      <div className="playground-copy">
        <p className="section-kicker">{zh ? "在线演示" : "Section 05"}</p>
        <h2 className="section-title">
          {zh ? "发送一次。" : "Speak once."}
          <br />
          {zh ? "路由到所有模型。" : "Route everywhere."}
        </h2>
        <div className="play-switch" role="tablist" aria-label="Playground model">
          {SAMPLES.map((sample) => (
            <button
              key={sample.model}
              type="button"
              role="tab"
              aria-selected={active.model === sample.model}
              data-cursor="hover"
              className={cn("filter-chip", active.model === sample.model && "is-on")}
              onClick={() => setActive(sample)}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
      <LiquidGlass className="terminal" interactive={false}>
        <div className="terminal-pane">
          <p className="terminal-label">{zh ? "请求" : "Request"}</p>
          <pre>
            <code>
              <span className="tok-ice">curl</span>{" "}
              <span className="tok-ink">https://api.fytapi.com/v1/chat/completions</span>
              {" \\\n  "}
              <span className="tok-mute">-H</span>{" "}
              <span className="tok-ink">"Authorization: Bearer $FYT_API_KEY"</span>
              {" \\\n  "}
              <span className="tok-mute">-H</span>{" "}
              <span className="tok-ink">"Content-Type: application/json"</span>
              {" \\\n  "}
              <span className="tok-mute">-d</span>{" "}
              <span className="tok-ink">
                {`'{\n    "model": "${active.model}",\n    "messages": [\n      { "role": "user", "content": "Orbit the moon." }\n    ]\n  }'`}
              </span>
            </code>
          </pre>
        </div>
        <div className="terminal-rule" aria-hidden="true" />
        <div className="terminal-pane">
          <p className="terminal-label">
            {zh ? "响应" : "Response"}
            <span className="api-ok">
              <i />
              200
            </span>
          </p>
          <pre>
            <code>
              <span className="tok-mute">{"{\n  "}</span>
              <span className="tok-ice">"id"</span>
              <span className="tok-mute">: </span>
              <span className="tok-ink">"chatcmpl-fyt-04k2"</span>
              <span className="tok-mute">{",\n  "}</span>
              <span className="tok-ice">"model"</span>
              <span className="tok-mute">: </span>
              <span className="tok-ink">{`"${active.model}"`}</span>
              <span className="tok-mute">{",\n  "}</span>
              <span className="tok-ice">"choices"</span>
              <span className="tok-mute">{": [{\n    "}</span>
              <span className="tok-ice">"message"</span>
              <span className="tok-mute">{": {\n      "}</span>
              <span className="tok-ice">"role"</span>
              <span className="tok-mute">: </span>
              <span className="tok-ink">"assistant"</span>
              <span className="tok-mute">{",\n      "}</span>
              <span className="tok-ice">"content"</span>
              <span className="tok-mute">: </span>
              <span className="tok-ink">{`"${active.reply}"`}</span>
              <span className="tok-mute">{"\n    }\n  }]\n}"}</span>
            </code>
          </pre>
        </div>
      </LiquidGlass>
    </section>
  );
}
