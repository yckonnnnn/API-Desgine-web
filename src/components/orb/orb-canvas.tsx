import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { OrbScene } from "./orb-scene";

export function OrbCanvas({ appearance = "site" }: { appearance?: "site" | "auth" }) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div className={cn("orb-stage", appearance === "auth" && "orb-stage--auth")} aria-hidden="true">
      <div className={cn("orb-fallback", ready && "is-hidden")} />
      <OrbScene onReady={onReady} appearance={appearance} />
    </div>
  );
}
