import type { ReactNode } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ConsoleSidebar } from "@/components/console/console-sidebar";
import { Grain } from "@/components/layout/grain";
import { PageVeil } from "@/components/layout/page-veil";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { LanguageProvider, useLanguage } from "@/lib/language";

/**
 * Console chrome. Wrapped in its own LanguageProvider so the workspace follows
 * the same zh/en toggle as the marketing site (default zh) — without it,
 * `useLanguage` would throw, since this tree renders outside `SiteChrome`.
 *
 * All workspace navigation lives in `ConsoleSidebar`; the marketing `Navbar` is
 * deliberately NOT rendered here, so the workspace shows one navigation.
 */

/** One Toaster for the whole workspace, styled to match the ops surfaces.
 *  Wrapped in a fixed host so its static root never lands in the shell's grid. */
function OpsToaster() {
  return (
    <div className="ops-toast-host">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgb(255 255 255 / 0.94)",
            border: "1px solid rgb(17 18 20 / 0.08)",
            color: "#111214",
            borderRadius: "14px",
            boxShadow: "0 18px 44px -22px rgb(17 18 20 / 0.35)",
            fontSize: "13px",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </div>
  );
}

function ConsoleFrame({
  children,
  ready = false,
}: {
  children: ReactNode;
  ready?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="ops-root">
      <Grain />
      <PageVeil />
      <CustomCursor />
      <div className="ops-orb" aria-hidden="true" />
      <OpsToaster />
      <ConsoleSidebar pathname={pathname} ready={ready} />
      <div className="ops-main">{children}</div>
    </div>
  );
}

export function ConsoleShell() {
  // Provider first: the sidebar reads the language for its labels.
  return (
    <LanguageProvider>
      <ConsoleGate />
    </LanguageProvider>
  );
}

function ConsoleGate() {
  const { user, isPending } = useCurrentUserState();
  const { language } = useLanguage();
  const zh = language === "zh";

  if (isPending) {
    return (
      <ConsoleFrame>
        <div className="ops-page">
          <p className="ops-dim">{zh ? "正在打开工作台…" : "Opening workspace…"}</p>
        </div>
      </ConsoleFrame>
    );
  }
  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <ConsoleFrame ready>
      <Outlet />
    </ConsoleFrame>
  );
}
