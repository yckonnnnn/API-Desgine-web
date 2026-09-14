import type { ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Grain } from "@/components/layout/grain";
import { PageVeil } from "@/components/layout/page-veil";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/console" as const, label: "Overview" },
  { to: "/console/keys" as const, label: "API Keys" },
  { to: "/console/wallet" as const, label: "Wallet" },
  { to: "/console/usage" as const, label: "Usage" },
  { to: "/console/billing" as const, label: "Billing" },
];

function ConsoleFrame({
  children,
  ready = false,
}: {
  children: ReactNode;
  ready?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="console-root">
      <Grain />
      <PageVeil />
      <div className="console-orb" aria-hidden="true" />
      <aside className="console-side">
        <Link to="/" className="wordmark">
          <span className="wordmark-mark" aria-hidden="true" />
          FYT
        </Link>
        <nav>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "console-link",
                ready &&
                  (item.to === "/console" ? pathname === "/console" : pathname.startsWith(item.to)) &&
                  "is-on",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {ready ? (
          <div className="user-chip">
            <UserButton />
          </div>
        ) : (
          <span className="auth-skel" aria-hidden="true" />
        )}
      </aside>
      <div className="console-main">{children}</div>
    </div>
  );
}

export function ConsoleShell() {
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
