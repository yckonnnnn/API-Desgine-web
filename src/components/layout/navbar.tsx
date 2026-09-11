import { LiquidGlass } from "@/components/glass/liquid-glass";

const LINKS = [
  { href: "#models", label: "Models" },
  { href: "#infrastructure", label: "Infrastructure" },
];

export function Navbar() {
  return (
    <header className="site-nav">
      <LiquidGlass className="nav-bar" interactive={false}>
        <a href="#top" className="wordmark" data-cursor="hover">
          <span className="wordmark-mark" aria-hidden="true" />
          FYT
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} data-cursor="hover">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button type="button" className="nav-ghost" data-cursor="hover">
            Sign in
          </button>
          <a href="#models" className="nav-cta" data-cursor="hover">
            Start building
          </a>
        </div>
      </LiquidGlass>
    </header>
  );
}
