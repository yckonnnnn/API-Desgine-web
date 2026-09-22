import type { ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Activity, KeyRound, LayoutDashboard, Receipt, Wallet } from "lucide-react";
import { Toaster } from "sonner";
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
 *
 * Restyled on the `ops-*` namespace (see styles.css) so the wallet page can
 * stay on the legacy `console-*` classes untouched.
 */
const NAV = [
  { to: "/console" as const, label: "Overview", zh: "概览", icon: LayoutDashboard },
  { to: "/console/keys" as const, label: "API Keys", zh: "密钥", icon: KeyRound },
  { to: "/console/wallet" as const, label: "Wallet", zh: "钱包", icon: Wallet },
  { to: "/console/usage" as const, label: "Usage", zh: "用量", icon: Activity },
  { to: "/console/billing" as const, label: "Billing", zh: "账单", icon: Receipt },
];

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
  const { language, setLanguage } = useLanguage();
  const zh = language === "zh";

  return (
    <div className="ops-root">
      <Grain />
      <PageVeil />
      <CustomCursor />
      <div className="ops-orb" aria-hidden="true" />
      <OpsToaster />
      <aside className="ops-side">
        <Link to="/" className="wordmark ops-brand" data-cursor="hover">
          <span className="wordmark-mark" aria-hidden="true" />
          FYT
        </Link>

        <nav aria-label={zh ? "工作台" : "Console"}>
          <p className="ops-nav-label">{zh ? "工作台" : "Workspace"}</p>
          {NAV.map((item) => {
            const Icon = item.icon;
            const on =
              ready &&
              (item.to === "/console" ? pathname === "/console" : pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn("ops-link", on && "is-on")}
                data-cursor="hover"
                aria-current={on ? "page" : undefined}
              >
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                {zh ? item.zh : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ops-side-foot">
          <div className="ops-lang" role="group" aria-label={zh ? "界面语言" : "Language"}>
            <button
              type="button"
              className={cn(zh && "is-on")}
              data-cursor="hover"
              aria-pressed={zh}
              onClick={() => setLanguage("zh")}
            >
              中
            </button>
            <button
              type="button"
              className={cn(!zh && "is-on")}
              data-cursor="hover"
              aria-pressed={!zh}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>
          <div className="ops-foot-user">
            {ready ? <UserButton language={language} /> : <span className="auth-skel" aria-hidden="true" />}
          </div>
        </div>
      </aside>
      <div className="ops-main">{children}</div>
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
