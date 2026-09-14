import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/hero";
import { SiteChrome } from "@/components/layout/site-chrome";
import { InfraSection } from "@/components/sections/infra-section";
import { ModelsSection } from "@/components/sections/models-section";
import { OrbitSection } from "@/components/sections/orbit-section";
import { PlaygroundSection } from "@/components/sections/playground-section";
import { SiteFooter } from "@/components/sections/site-footer";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteChrome>
      <main className="site">
        <Hero />
        <ModelsSection />
        <OrbitSection />
        <InfraSection />
        <PlaygroundSection />
        <SiteFooter />
      </main>
    </SiteChrome>
  );
}
