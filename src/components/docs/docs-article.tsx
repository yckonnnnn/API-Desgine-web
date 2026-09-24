import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Info, KeyRound } from "lucide-react";
import { useLanguage } from "@/lib/language";
import {
  DOC_GROUPS,
  DOC_PAGE_BY_ID,
  docText,
  type DocPage,
  type DocPageId,
} from "@/lib/docs-content";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsNav } from "@/components/docs/docs-nav";

function ArticlePager({ page, zh }: { page: DocPage; zh: boolean }) {
  const previous = page.previous ? DOC_PAGE_BY_ID[page.previous] : undefined;
  const next = page.next ? DOC_PAGE_BY_ID[page.next] : undefined;

  return (
    <nav className="doc-pager" aria-label={zh ? "文档翻页" : "Documentation pagination"}>
      {previous ? (
        <Link to={previous.href} className="doc-pager-link" data-cursor="hover">
          <span className="doc-pager-dir">
            <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" />
            {zh ? "上一篇" : "Previous"}
          </span>
          <span className="doc-pager-title">{docText(previous.title, zh)}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={next.href} className="doc-pager-link is-next" data-cursor="hover">
          <span className="doc-pager-dir">
            {zh ? "下一篇" : "Next"}
            <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="doc-pager-title">{docText(next.title, zh)}</span>
        </Link>
      )}
    </nav>
  );
}

export function DocsArticle({ pageId }: { pageId: DocPageId }) {
  const { language } = useLanguage();
  const zh = language === "zh";
  const page = DOC_PAGE_BY_ID[pageId];
  const group = DOC_GROUPS.find((item) => item.id === page.group)!;

  return (
    <main className="doc-main">
      <aside className="doc-side">
        <div className="doc-side-sticky">
          <DocsNav currentPage={pageId} />
        </div>
      </aside>

      <article className="doc-article">
        <header className="doc-article-head">
          <p className="section-kicker">
            <span className="kicker-dot" aria-hidden="true" />
            {docText(group.label, zh)} · {docText(page.eyebrow, zh)}
          </p>
          <h1 className="doc-article-title">{docText(page.title, zh)}</h1>
          <p className="doc-article-lede">{docText(page.description, zh)}</p>
          <div className="doc-article-actions">
            <Link to="/console/keys" className="btn-ink" data-cursor="hover">
              <KeyRound size={15} strokeWidth={1.9} aria-hidden="true" />
              {zh ? "创建 API Key" : "Create API key"}
            </Link>
            <Link to="/models" className="btn-ghost" data-cursor="hover">
              {zh ? "浏览模型" : "Browse models"}
            </Link>
          </div>
        </header>

        <div className="doc-sections">
          {page.sections.map((section) => (
            <section key={section.id} id={section.id} className="doc-section">
              <h2 className="doc-section-title">{docText(section.title, zh)}</h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph.en} className="doc-p">
                  {docText(paragraph, zh)}
                </p>
              ))}

              {section.bullets && (
                <ul className="doc-list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet.en}>
                      <span className="doc-list-dot" aria-hidden="true" />
                      <span>{docText(bullet, zh)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.table && (
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        {section.table.head.map((cell) => (
                          <th key={cell.en}>{docText(cell, zh)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row[0].en}>
                          {row.map((cell, index) => (
                            <td key={cell.en} className={index === 0 ? "is-key" : undefined}>
                              {docText(cell, zh)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.code && <CodeBlock sample={section.code} />}

              {section.note && (
                <p className="doc-note">
                  <Info size={15} strokeWidth={1.9} aria-hidden="true" />
                  <span>{docText(section.note, zh)}</span>
                </p>
              )}
            </section>
          ))}
        </div>

        <ArticlePager page={page} zh={zh} />
      </article>

      <aside className="doc-toc">
        <div className="doc-toc-sticky">
          <p className="doc-toc-label">{zh ? "本页目录" : "On this page"}</p>
          <nav aria-label={zh ? "本页目录" : "On this page"}>
            {page.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} data-cursor="hover">
                {docText(section.title, zh)}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </main>
  );
}
