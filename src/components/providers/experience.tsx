import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { scene } from "@/lib/scene-state";

type Props = { children: ReactNode };

export function ExperienceProvider({ children }: Props) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const applyFlags = () => {
      scene.reduced = reduced.matches;
      scene.mobile = mobile.matches || !window.matchMedia("(hover: hover)").matches;
    };
    applyFlags();
    reduced.addEventListener("change", applyFlags);
    mobile.addEventListener("change", applyFlags);

    const onPointer = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      scene.targetMouseX = Math.min(Math.max(nx, -1), 1);
      scene.targetMouseY = Math.min(Math.max(-ny, -1), 1);
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    if (reduced.matches) {
      const onScroll = () => {
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        scene.targetScroll = limit > 0 ? window.scrollY / limit : 0;
        scene.scroll = scene.targetScroll;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        reduced.removeEventListener("change", applyFlags);
        mobile.removeEventListener("change", applyFlags);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScroll);
      };
    }

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      autoRaf: false,
      anchors: true,
    });

    lenis.on("scroll", () => {
      const limit = lenis.limit;
      scene.targetScroll = limit > 0 ? lenis.scroll / limit : 0;
      ScrollTrigger.update();
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      reduced.removeEventListener("change", applyFlags);
      mobile.removeEventListener("change", applyFlags);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return children;
}
