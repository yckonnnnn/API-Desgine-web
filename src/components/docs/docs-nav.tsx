import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import {
  DOC_GROUPS,
  DOC_PAGES,
  docText,
  type DocPageId,
} from "@/lib/docs-content";

/**
 * Documentation sidebar: a search box over the pages, grouped the way the
 * content is. Shared by the desktop column and the mobile drawer so the two can
 * never drift apart.
 */
export function DocsNav({
  currentPage,
  onNavigate,
}: {
  currentPage?: DocPageId;
  onNavigate?: () => void;
}) {
  const { language } = useLanguage();
  const zh = language === "zh";
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      DOC_PAGES.filter((page) => {
        if (!normalized) return true;
        const haystack = [
          docText(page.title, true),
          docText(page.title, false),
          docText(page.description, true),
          docText(page.description, false),
          docText(page.eyebrow, true),
          docText(page.eyebrow, false),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalized);
      }),
    [normalized],
  );

  return (
    <div className="doc-nav">
      <label className="doc-nav-search">
        <Search size={16} strokeWidth={1.8} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={zh ? "搜索文档" : "Search documentation"}
          aria-label={zh ? "搜索文档" : "Search documentation"}
        />
      </label>

      <nav className="doc-nav-groups" aria-label={zh ? "文档导航" : "Documentation navigation"}>
        {DOC_GROUPS.map((group) => {
          const pages = filtered.filter((page) => page.group === group.id);
          if (pages.length === 0) return null;
          return (
            <div className="doc-nav-group" key={group.id}>
              <p className="doc-nav-label">{docText(group.label, zh)}</p>
              {pages.map((page) => (
                <Link
                  key={page.id}
                  to={page.href}
                  onClick={onNavigate}
                  data-cursor="hover"
                  className={cn("doc-nav-link", currentPage === page.id && "is-on")}
                >
                  {docText(page.title, zh)}
                </Link>
              ))}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="doc-nav-empty">{zh ? "没有匹配的文档" : "No documentation found"}</p>
        )}
      </nav>
    </div>
  );
}
