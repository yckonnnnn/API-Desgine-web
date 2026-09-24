import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Braces,
  Check,
  CircleHelp,
  Code2,
  Copy,
  KeyRound,
  Layers3,
  Search,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useCopy } from "@/lib/use-copy";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import { ModelLogo } from "@/components/models/model-logo";
import {
  DOC_BASE_URL,
  DOC_GROUPS,
  DOC_PAGES,
  docText,
  type DocPageId,
} from "@/lib/docs-content";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsRouteVisual } from "@/components/docs/docs-route-visual";

const ICONS: Record<DocPageId, typeof Zap> = {
  quickstart: Zap,
  models: Layers3,
  openai: Braces,
  anthropic: Bot,
  "claude-code": Terminal,
  codex: Code2,
  troubleshooting: CircleHelp,
};

/**
 * Pages whose subject *is* a vendor: the real provider mark says more at a
 * glance than a generic brace or robot glyph. The two client guides keep their
 * terminal icons — they are about a CLI, not about the vendor behind it.
 */
const CARD_LOGOS: Partial<Record<DocPageId, string>> = {
  openai: "OpenAI",
  anthropic: "Claude",
};

/** The hero headline breaks exactly here, so each line can rise on its own. */
const TITLE_LINES = {
  zh: ["把 Foyton API", "接进你的系统"],
  en: ["Build with", "Foyton API"],
};

/** The three moves between an empty console and a first streaming reply. */
const START_STEPS = [
  {
    title: { zh: "创建 API Key", en: "Create an API key" },
    desc: {
      zh: "在控制台生成密钥，按项目区分配额。",
      en: "Generate a key in the console, scoped per project.",
    },
  },
  {
    title: { zh: "替换 Base URL", en: "Change the Base URL" },
    desc: {
      zh: "把客户端指向 fytapi.com，沿用现有 SDK。",
      en: "Point your client at fytapi.com and keep your SDK.",
    },
  },
  {
    title: { zh: "发出第一个请求", en: "Send your first request" },
    desc: {
      zh: "复制示例即可拿到流式响应。",
      en: "Run the copy-ready sample and stream a reply.",
    },
  },
] as const;

const QUICKSTART_SAMPLE = {
  language: "bash",
  label: "cURL",
  content: `curl ${DOC_BASE_URL}/v1/chat/completions \\
  -H "Authorization: Bearer <FYTAPI_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-5","messages":[{"role":"user","content":"Hello"}]}'`,
};

export function DocsHome() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const [query, setQuery] = useState("");
  const { copied, copy } = useCopy();
  const { ref: gridRef, inView } = useInView<HTMLDivElement>();
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
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalized);
      }),
    [normalized],
  );

  const groupLabel = (id: (typeof DOC_GROUPS)[number]["id"]) =>
    docText(DOC_GROUPS.find((group) => group.id === id)!.label, zh);

  return (
    <main className="doc-home">
      <section className="doc-hero">
        <div className="doc-hero-lead">
          <p className="section-kicker doc-hero-kicker">
            <span className="kicker-dot" aria-hidden="true" />
            {zh ? "开发者中心" : "Developer center"}
          </p>
          <h1 className="doc-hero-title">
            {(zh ? TITLE_LINES.zh : TITLE_LINES.en).map((line, index) => (
              <span className="line-mask" key={line}>
                <span className="line-inner" style={{ animationDelay: `${0.1 + index * 0.12}s` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="doc-hero-lede reveal delay-3">
            {zh
              ? "一个网关接入多家模型。跟着可复制的示例，从第一个请求走到生产上线。"
              : "Connect several model providers through one gateway. Follow copy-ready examples from your first request to production."}
          </p>

          <div className="doc-hero-actions reveal delay-4">
            <Link to="/docs/quickstart" className="btn-ink" data-cursor="hover">
              <Zap size={15} strokeWidth={1.9} aria-hidden="true" />
              {zh ? "5 分钟开始" : "Start in 5 minutes"}
            </Link>
            <Link to="/console/keys" className="btn-ghost" data-cursor="hover">
              <KeyRound size={15} strokeWidth={1.9} aria-hidden="true" />
              {zh ? "创建 API Key" : "Create API key"}
            </Link>
          </div>

          <div className="doc-baseurl reveal delay-5">
            <span className="doc-baseurl-label">API Base URL</span>
            <code>{DOC_BASE_URL}</code>
            <button
              type="button"
              className="doc-baseurl-copy"
              onClick={() => void copy(DOC_BASE_URL)}
              data-cursor="hover"
              aria-label={copied === DOC_BASE_URL ? (zh ? "已复制" : "Copied") : zh ? "复制" : "Copy"}
            >
              {copied === DOC_BASE_URL ? (
                <Check size={15} strokeWidth={2} />
              ) : (
                <Copy size={15} strokeWidth={1.8} />
              )}
              <span>{copied === DOC_BASE_URL ? (zh ? "已复制" : "Copied") : zh ? "复制" : "Copy"}</span>
            </button>
          </div>
        </div>

        <div className="doc-hero-visual reveal delay-4">
          <DocsRouteVisual />
        </div>
      </section>

      <section className="doc-index" aria-label={zh ? "文档目录" : "Documentation index"}>
        <div className="doc-index-head">
          <div className="doc-index-lead">
            <h2 className="doc-index-title">{zh ? "选择你的路径" : "Pick a path"}</h2>
            <p className="doc-index-count">
              {normalized
                ? zh
                  ? `${filtered.length} 个结果`
                  : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
                : zh
                  ? `${DOC_PAGES.length} 篇指南`
                  : `${DOC_PAGES.length} guides`}
            </p>
          </div>
          <label className="doc-index-search">
            <Search size={16} strokeWidth={1.8} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={zh ? "搜索指南、协议与排错" : "Search guides, protocols, and troubleshooting"}
              aria-label={zh ? "搜索文档" : "Search documentation"}
            />
          </label>
        </div>

        <div ref={gridRef} className={cn("doc-cards", inView && "is-in")}>
          {filtered.map((page, index) => {
            const Icon = ICONS[page.id];
            const logo = CARD_LOGOS[page.id];
            const featured = index === 0 && !normalized && page.id === "quickstart";

            if (featured) {
              return (
                <Link
                  key={page.id}
                  to={page.href}
                  data-cursor="hover"
                  className="doc-card doc-card--wide"
                  style={{ "--i": index } as CSSProperties}
                >
                  <div className="doc-card-main">
                    <span className="doc-card-icon" aria-hidden="true">
                      <Icon size={19} strokeWidth={1.8} />
                    </span>
                    <p className="doc-card-group">{groupLabel(page.group)}</p>
                    <h3 className="doc-card-title">{docText(page.title, zh)}</h3>
                    <p className="doc-card-desc">{docText(page.description, zh)}</p>
                    <span className="doc-card-cta">
                      {zh ? "开始使用" : "Start here"}
                      <ArrowRight size={15} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                  </div>

                  <ol className="doc-steps">
                    {START_STEPS.map((step, stepIndex) => (
                      <li className="doc-step" key={step.title.zh}>
                        <span className="doc-step-num" aria-hidden="true">
                          {stepIndex + 1}
                        </span>
                        <p className="doc-step-title">{zh ? step.title.zh : step.title.en}</p>
                        <p className="doc-step-desc">{zh ? step.desc.zh : step.desc.en}</p>
                      </li>
                    ))}
                  </ol>
                </Link>
              );
            }

            return (
              <Link
                key={page.id}
                to={page.href}
                data-cursor="hover"
                className="doc-card"
                style={{ "--i": index } as CSSProperties}
              >
                <span
                  className={cn("doc-card-icon", logo && "doc-card-icon--logo")}
                  aria-hidden="true"
                >
                  {logo ? <ModelLogo name={logo} size={22} /> : <Icon size={19} strokeWidth={1.8} />}
                </span>
                <p className="doc-card-group">{groupLabel(page.group)}</p>
                <h3 className="doc-card-title">{docText(page.title, zh)}</h3>
                <p className="doc-card-desc">{docText(page.description, zh)}</p>
                <span className="doc-card-arrow" aria-hidden="true">
                  <ArrowRight size={17} strokeWidth={1.9} />
                </span>
              </Link>
            );
          })}

          {filtered.length === 0 && (
            <div className="doc-empty">
              <BookOpen size={26} strokeWidth={1.6} aria-hidden="true" />
              <p className="doc-empty-title">{zh ? "没有匹配的文档" : "No documentation found"}</p>
              <p className="doc-empty-sub">
                {zh ? "换个关键词，或浏览全部指南。" : "Try another keyword or browse every guide."}
              </p>
              <button type="button" className="btn-ghost" onClick={() => setQuery("")} data-cursor="hover">
                {zh ? "清除搜索" : "Clear search"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="doc-band">
        <div className="doc-band-inner">
          <div className="doc-band-copy">
            <p className="section-kicker">
              <span className="kicker-dot" aria-hidden="true" />
              {zh ? "生产可用" : "Production ready"}
            </p>
            <h2 className="doc-band-title">
              {zh ? "一个端点，沿用现有 SDK" : "One endpoint, your existing SDKs"}
            </h2>
            <p className="doc-band-lede">
              {zh
                ? "保留你正在用的客户端，只替换 Base URL、填入 API Key，再选一个当前分组可用的模型。"
                : "Keep the client you already use. Change the Base URL, supply a Foyton API key, and select a model enabled for your account."}
            </p>
            <ul className="doc-band-list">
              {(zh
                ? ["OpenAI 兼容请求", "Anthropic Messages 支持", "流式响应", "编程客户端接入指南"]
                : [
                    "OpenAI-compatible requests",
                    "Anthropic Messages support",
                    "Streaming responses",
                    "Coding client guides",
                  ]
              ).map((item) => (
                <li key={item}>
                  <span className="doc-band-check" aria-hidden="true">
                    <Check size={12} strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="doc-band-foot">
              <Sparkles size={14} strokeWidth={1.8} aria-hidden="true" />
              {zh
                ? "示例中的模型名与模型列表一致，可直接复制运行。"
                : "Model names in the examples match the model list, so they run as copied."}
            </p>
          </div>
          <CodeBlock sample={QUICKSTART_SAMPLE} className="doc-band-code" />
        </div>
      </section>
    </main>
  );
}
