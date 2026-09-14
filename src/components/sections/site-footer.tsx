import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <Link to="/" className="wordmark" data-cursor="hover">
        <span className="wordmark-mark" aria-hidden="true" />
        FYT
      </Link>
      <p>AI infrastructure for production systems.</p>
      <nav>
        <Link to="/models" data-cursor="hover">
          Models
        </Link>
        <Link to="/login" data-cursor="hover">
          Console
        </Link>
      </nav>
    </footer>
  );
}
