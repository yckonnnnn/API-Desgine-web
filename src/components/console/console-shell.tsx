import type { ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Activity, KeyRound, LayoutDashboard, Receipt, Wallet } from "lucide-react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Grain } from "@/components/layout/grain";
import { PageVeil } from "@/components/layout/page-veil";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

/**
 * Console chrome. Wrapped in its own LanguageProvider so the workspace follows
 * the same zh/en toggle as the marketing site (default zh) — without it,
 * `useLanguage` would throw, since this tree renders outside `SiteChrome`.
 */
const NAV = [
  { to: "/console" as const, label: "Overview", zh: "概览", icon: LayoutDashboard },
  { to: "/console/keys" as const, label: "API Keys", zh: "密钥", icon: KeyRound },
  { to: "/console/wallet" as const, label: "Wallet", zh: "钱包", icon: Wallet },
  { to: "/console/usage" as const, label: "Usage", zh: "用量", icon: Activity },
  { to: "/console/billing" as const, label: "Billing", zh: "账单", icon: Receipt },
];

function ConsoleFrame({
  children,
  ready = false,
}: {
  children: ReactNode;
  ready?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { language } = useLanguage();
  const zh = language === "zh";

  return (
    <div className="console-root">
      <Grain />
      <PageVeil />
      <CustomCursor />
      <div className="console-orb" aria-hidden="true" />
      <aside className="console-side">
        <Link to="/" className="wordmark console-brand" data-cursor="hover">
          <span className="wordmark-mark" aria-hidden="true" />
          FYT
        </Link>

        <nav aria-label="Console">
          <p className="console-nav-label">{zh ? "工作台" : "Workspace"}</p>
          {NAV.map((item) => {
            const Icon = item.icon;
            const on =
              ready &&
              (item.to === "/console" ? pathname === "/console" : pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn("console-link", on && "is-on")}
                data-cursor="hover"
                aria-current={on ? "page" : undefined}
              >
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                {zh ? item.zh : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="console-side-foot">
          {ready ? <UserButton language={language} /> : <span className="auth-skel" aria-hidden="true" />}
        </div>
      </aside>
      <div className="console-main">{children}</div>
    </div>
  );
}

export function ConsoleShell() {
  // Provider first: `ConsoleFrame` reads the language for its nav labels.
  return (
    <LanguageProvider>
      <ConsoleGate />
    </LanguageProvider>
  );
}

function ConsoleGate() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <ConsoleFrame>
        <p className="console-muted">Opening workspace…</p>
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
