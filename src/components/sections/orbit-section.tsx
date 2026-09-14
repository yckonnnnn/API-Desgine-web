import { useState } from "react";
import { ORBIT_NODES } from "@/lib/models";
import { cn } from "@/lib/utils";

export function OrbitSection() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="orbit" className="orbit">
      <div className="orbit-copy">
        <p className="section-kicker">Section 04</p>
        <h2 className="section-title">
          One core.
          <br />
          Every origin.
        </h2>
        <p className="orbit-lede">
          FYT sits at the center of the intelligence layer — routing to OpenAI,
          Anthropic, Google, DeepSeek, xAI, Qwen, and Kimi through a single
          endpoint.
        </p>
      </div>
      <div
        className={cn("orbit-stage", paused && "is-paused")}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <span className="orbit-ring ring-a" />
        <span className="orbit-ring ring-b" />
        <span className="orbit-ring ring-c" />
        <div className="orbit-core">
          <span>FYT</span>
        </div>
        {ORBIT_NODES.map((node) => (
          <span
            key={node.name}
            className="orbit-rotor"
            style={{ ["--angle" as string]: `${node.angle}deg` }}
          >
            <span className="orbit-node">
              <span className="orbit-chip">
                <i />
                {node.name}
              </span>
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
