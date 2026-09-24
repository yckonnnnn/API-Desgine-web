import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DocsOutro, DocsShell } from "@/components/docs/docs-shell";
import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteFooter } from "@/components/sections/site-footer";

export const Route = createFileRoute("/docs")({ component: DocsLayout });

/**
 * One chrome for every docs route; the pages themselves render the content.
 *
 * This component stays free of `useLanguage`: it renders the provider (via
 * `SiteChrome`) that everything below it reads from, so a hook call here would
 * run above its own context.
 */
function DocsLayout() {
  return (
    <SiteChrome orb={false}>
      <main className="site doc-site">
        <DocsShell>
          <Outlet />
        </DocsShell>
        <DocsOutro />
        <SiteFooter />
      </main>
    </SiteChrome>
  );
}
