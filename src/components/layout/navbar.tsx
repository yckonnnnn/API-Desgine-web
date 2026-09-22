import { Link } from "@tanstack/react-router";
import { LiquidGlass } from "@/components/glass/liquid-glass";
import { AuthSlot, StartCta } from "@/components/layout/auth-slot";
import { FoytonBrand } from "@/components/layout/foyton-brand";
import { useLanguage } from "@/lib/language";

const LINKS = [
  { href: "/", label: "主页" },
  { href: "/models", label: "模型广场" },
  { href: "/console", label: "控制台" },
  { href: "/docs", label: "文档" },
  { href: "/contact", label: "联系我们" },
];

export function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const copy = language === "zh"
    ? { home: "主页", models: "模型广场", console: "控制台", docs: "文档", contact: "联系我们", language: "中文", signIn: "登录", start: "开始使用" }
    : { home: "Home", models: "Models", console: "Console", docs: "Docs", contact: "Contact", language: "EN", signIn: "Sign in", start: "Start building" };

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
            link.href === "/models" || link.href === "/console" ? (
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
          <AuthSlot language={language} />
          <button type="button" className="language-toggle" onClick={toggleLanguage} aria-label="切换语言">
            {copy.language}
          </button>
          <StartCta className="nav-cta" language={language} />
        </div>
      </LiquidGlass>
    </header>
  );
}
