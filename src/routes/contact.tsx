import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ContactPage } from "@/components/sections/contact-page";
import { SiteFooter } from "@/components/sections/site-footer";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <SiteChrome orb={false}>
      <main className="site">
        <ContactPage />
        <SiteFooter />
      </main>
    </SiteChrome>
  );
}
