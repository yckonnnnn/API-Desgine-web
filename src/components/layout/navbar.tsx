import { Link } from "@tanstack/react-router";
import { LiquidGlass } from "@/components/glass/liquid-glass";
import { AuthSlot } from "@/components/layout/auth-slot";
import { FoytonBrand } from "@/components/layout/foyton-brand";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { NotificationBell } from "@/components/ui/notification-bell";
import { useLanguage } from "@/lib/language";

const LINKS = [
  { href: "/", label: "主页" },
  { href: "/models", label: "模型广场" },
  { href: "/console", label: "控制台" },
  { href: "/docs", label: "文档" },
  { href: "/contact", label: "联系我们", isRoute: true },
];

export function Navbar() {
  const { language } = useLanguage();
  const copy = language === "zh"
    ? { home: "主页", models: "模型广场", console: "控制台", docs: "文档", contact: "联系我们", signIn: "登录" }
    : { home: "Home", models: "Models", console: "Console", docs: "Docs", contact: "Contact", signIn: "Sign in" };

  const labelMap: Record<string, string> = {
    "主页": copy.home,
    "模型广场": copy.models,
    "控制台": copy.console,
    "文档": copy.docs,
    "联系我们": copy.contact,
  };

  return (
    <header className="site-nav">
      <LiquidGlass className="nav-bar" interactive={false}>
        <Link to="/" className="wordmark" data-cursor="hover">
          <FoytonBrand />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((link) =>
            link.isRoute || link.href === "/models" || link.href === "/console" ? (
              <Link key={link.label} to={link.href} data-cursor="hover">
                {labelMap[link.label]}
              </Link>
            ) : (
              <a key={link.label} href={link.href} data-cursor="hover">
                {labelMap[link.label]}
              </a>
            ),
          )}
        </nav>
        <div className="nav-actions">
          <LanguageSwitcher />
          <NotificationBell />
          <AuthSlot language={language} />
        </div>
      </LiquidGlass>
    </header>
  );
}
