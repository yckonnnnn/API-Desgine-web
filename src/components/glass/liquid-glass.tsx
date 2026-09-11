import type { HTMLAttributes, PointerEvent } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

function setMouseVars(el: HTMLElement, event: PointerEvent<HTMLElement>) {
  const r = el.getBoundingClientRect();
  const x = ((event.clientX - r.left) / Math.max(r.width, 1)) * 100;
  const y = ((event.clientY - r.top) / Math.max(r.height, 1)) * 100;
  el.style.setProperty("--mouse-x", `${x}%`);
  el.style.setProperty("--mouse-y", `${y}%`);
}

export function LiquidGlass({ className, children, interactive = true, onPointerMove, ...props }: Props) {
  return (
    <div
      className={cn("glass", interactive && "is-interactive", className)}
      onPointerMove={(event) => {
        setMouseVars(event.currentTarget, event);
        onPointerMove?.(event);
      }}
      {...props}
    >
      <span className="glass-specular" aria-hidden="true" />
      {children}
    </div>
  );
}
