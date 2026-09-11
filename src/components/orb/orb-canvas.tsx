import { useCallback, useEffect, useState, type ComponentType } from "react";
import { cn } from "@/lib/utils";

type SceneProps = { onReady: () => void };

const scenePromise =
  typeof window === "undefined" ? null : import("./orb-scene");

export function OrbCanvas() {
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = scenePromise ?? import("./orb-scene");
    void load.then((mod) => {
      if (!cancelled) setScene(() => mod.OrbScene);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div className="orb-stage" aria-hidden="true">
      <div className={cn("orb-fallback", ready && "is-hidden")} />
      {Scene ? <Scene onReady={onReady} /> : null}
    </div>
  );
}
