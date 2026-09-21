import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/hero";
import { SiteChrome } from "@/components/layout/site-chrome";
import { EcosystemSection } from "@/components/sections/ecosystem-section";
import { InfraSection } from "@/components/sections/infra-section";
import { ModelsSection } from "@/components/sections/models-section";
import { WarpTunnelSection } from "@/components/sections/warp-tunnel-section";
import { SiteFooter } from "@/components/sections/site-footer";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteChrome>
      <main className="site">
        <Hero />
        <EcosystemSection />
        <ModelsSection />
        <InfraSection />
        <WarpTunnelSection />
        <SiteFooter />
      </main>
    </SiteChrome>
  );
}
