import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { Hero } from "@/components/hero/hero";
import { Grain } from "@/components/layout/grain";
import { Navbar } from "@/components/layout/navbar";
import { OrbCanvas } from "@/components/orb/orb-canvas";
import { InfraSection } from "@/components/sections/infra-section";
import { ModelsSection } from "@/components/sections/models-section";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <Grain />
      <OrbCanvas />
      <Navbar />
      <CustomCursor />
      <main className="site">
        <Hero />
        <ModelsSection />
        <InfraSection />
      </main>
    </>
  );
}
