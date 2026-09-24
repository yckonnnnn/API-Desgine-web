import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Activity, FileText, House, KeyRound, LayoutDashboard, Menu, Receipt, Wallet, X } from "lucide-react";
import { FoytonBrand } from "@/components/layout/foyton-brand";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { NotificationBell } from "@/components/ui/notification-bell";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

/**
 * Workspace chrome: one fixed sidebar holding everything the workspace needs —
 * workspace pages, the way back to the marketing site, the language control
 * and the account. It replaces the top bar outright rather than sitting under
 * one, and its 248px column is what keeps the working area from stretching
 * edge to edge on a wide monitor.
 *
 * Below 1024px the sidebar leaves the flow and becomes an off-canvas drawer
 * behind a slim bar with the menu button, so a phone still gets exactly one
 * navigation row on screen.
 */
const NAV = [
  { to: "/console/wallet" as const, zh: "钱包", en: "Wallet", icon: Wallet },
  { to: "/console/overview" as const, zh: "概况", en: "Overview", icon: LayoutDashboard },
  { to: "/console/keys" as const, zh: "API 密钥", en: "API keys", icon: KeyRound },
  { to: "/console/usage" as const, zh: "用量", en: "Usage", icon: Activity },
  { to: "/console/logs" as const, zh: "使用日志", en: "Usage logs", icon: FileText },
  { to: "/console/billing" as const, zh: "账单", en: "Billing", icon: Receipt },
];

export function ConsoleSidebar({
  pathname,
  ready,
}: {
  pathname: string;
  /** False while the session is still resolving — no tab claims to be current yet. */
  ready: boolean;
}) {
  const { language } = useLanguage();
  const { isPending } = useCurrentUserState();
  const zh = language === "zh";
  const [open, setOpen] = useState(false);

  // A drawer that survives a navigation would hide the page it just opened.
  useEffect(() => setOpen(false), [pathname]);

  // Drawer dismissal + scroll lock, and a guard for the case where the window
  // grows past the breakpoint while the drawer is open (body would stay locked).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      <div className="ops-topbar">
        <button
          type="button"
          className="ops-menu-btn"
          data-cursor="hover"
          aria-expanded={open}
          aria-controls="ops-sidebar"
          aria-label={zh ? "打开菜单" : "Open menu"}
          onClick={() => setOpen((was) => !was)}
        >
          <Menu size={18} strokeWidth={1.9} aria-hidden="true" />
        </button>
        <Link to="/" className="ops-topbar-brand" data-cursor="hover">
          <FoytonBrand />
        </Link>
        <span className="ops-foot-user">
          {isPending ? <span className="auth-skel" aria-hidden="true" /> : <UserButton language={language} />}
        </span>
      </div>

      {open ? <div className="ops-scrim" aria-hidden="true" onClick={() => setOpen(false)} /> : null}

      <aside id="ops-sidebar" className={cn("ops-side", open && "is-open")}>
        {/* The bar's menu button ends up underneath the drawer, so the drawer
            carries its own way out. Drawer-only — the desktop rail has no use
            for it. */}
        <button
          type="button"
          className="ops-drawer-close"
          aria-label={zh ? "关闭菜单" : "Close menu"}
          onClick={() => setOpen(false)}
        >
          <X size={17} strokeWidth={1.9} aria-hidden="true" />
        </button>

        <Link to="/" className="ops-brand" data-cursor="hover">
          <FoytonBrand />
        </Link>

        <nav className="ops-nav" aria-label={zh ? "工作台" : "Console"}>
          <p className="ops-nav-label">{zh ? "工作台" : "Workspace"}</p>
          {NAV.map((item) => {
            const Icon = item.icon;
            const on =
              ready &&
              pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn("ops-link", on && "is-on")}
                data-cursor="hover"
                aria-current={on ? "page" : undefined}
              >
                <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                {zh ? item.zh : item.en}
              </Link>
            );
          })}
        </nav>

        <div className="ops-side-foot">
          <Link to="/" className="ops-back" data-cursor="hover">
            <House size={15} strokeWidth={1.8} aria-hidden="true" />
            {zh ? "返回主页" : "Back to home"}
          </Link>

          <div className="ops-side-user">
            <NotificationBell />
            <LanguageSwitcher />
            <span className="ops-foot-user">
              {isPending ? <span className="auth-skel" aria-hidden="true" /> : <UserButton language={language} />}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
