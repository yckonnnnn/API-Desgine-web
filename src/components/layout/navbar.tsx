import { Link } from "@tanstack/react-router";
import { LiquidGlass } from "@/components/glass/liquid-glass";
import { AuthSlot, StartCta } from "@/components/layout/auth-slot";

const LINKS = [
  { href: "/models", label: "Models" },
  { href: "/#infrastructure", label: "Infrastructure" },
  { href: "/#playground", label: "Playground" },
];

export function Navbar() {
  return (
    <header className="site-nav">
      <LiquidGlass className="nav-bar" interactive={false}>
        <Link to="/" className="wordmark" data-cursor="hover">
          <span className="wordmark-mark" aria-hidden="true" />
          FYT
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((link) =>
            link.href === "/models" ? (
              <Link key={link.label} to="/models" data-cursor="hover">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} data-cursor="hover">
                {link.label}
              </a>
            ),
          )}
        </nav>
        <div className="nav-actions">
          <AuthSlot />
          <StartCta className="nav-cta" />
        </div>
      </LiquidGlass>
    </header>
  );
}
