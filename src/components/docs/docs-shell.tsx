import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, KeyRound, Menu } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { DOC_PAGES } from "@/lib/docs-content";
import { DocsNav } from "@/components/docs/docs-nav";

/**
 * Shared frame for every docs route.
 *
 * The current page is derived from the pathname instead of passed in, because
 * the routes are children of one layout route and the layout is what renders
 * this frame.
 */
export function DocsShell({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const zh = language === "zh";
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const current = DOC_PAGES.find((page) => pathname.startsWith(page.href));
  const [open, setOpen] = useState(false);

  // A drawer left open across a navigation would cover the article it navigated to.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="doc-frame">
      <div className="doc-aurora" aria-hidden="true">
        <span className="doc-aurora-a" />
        <span className="doc-aurora-b" />
      </div>

      {current && (
        <div className={open ? "doc-drawer is-open" : "doc-drawer"}>
          <button
            type="button"
            className="doc-drawer-toggle"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            data-cursor="hover"
          >
            <span className="doc-drawer-title">
              <Menu size={16} strokeWidth={1.8} aria-hidden="true" />
              {zh ? "浏览文档" : "Browse documentation"}
            </span>
            <span className="doc-drawer-state">
              {open ? (zh ? "收起" : "Close") : zh ? "展开" : "Open"}
            </span>
          </button>
          {open && (
            <div className="doc-drawer-body">
              <DocsNav currentPage={current.id} onNavigate={() => setOpen(false)} />
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

/**
 * Closing strip between the last article section and the site footer: the two
 * calls to action a reader is most likely to want next.
 */
export function DocsOutro() {
  const { language } = useLanguage();
  const zh = language === "zh";

  return (
    <section className="doc-outro">
      <div className="doc-outro-inner">
        <DocsFooterNote />
        <div className="doc-outro-actions">
          <Link to="/models" className="btn-ghost" data-cursor="hover">
            {zh ? "浏览模型" : "Browse models"}
          </Link>
          <Link to="/console/keys" className="btn-ink" data-cursor="hover">
            <KeyRound size={15} strokeWidth={1.9} aria-hidden="true" />
            {zh ? "创建 API Key" : "Create API key"}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Icon + name used by the docs closing strip on every page. */
function DocsFooterNote() {
  const { language } = useLanguage();
  const zh = language === "zh";
  return (
    <div className="doc-foot-note">
      <span className="doc-foot-icon" aria-hidden="true">
        <BookOpen size={16} strokeWidth={1.8} />
      </span>
      <div>
        <p className="doc-foot-title">{zh ? "Foyton API 开发者文档" : "Foyton API documentation"}</p>
        <p className="doc-foot-sub">
          {zh ? "从第一个请求到生产上线，都在这里。" : "From your first request to production."}
        </p>
      </div>
    </div>
  );
}
