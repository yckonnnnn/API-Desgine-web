import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Code2,
  Copy,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ModelLogo } from "@/components/models/model-logo";
import { ModelDetailsDialog } from "@/components/models/model-details-dialog";
import { SiteFooter } from "@/components/sections/site-footer";
import { useLanguage } from "@/lib/language";
import { MODELS, type ModelInfo } from "@/lib/models";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/models")({ component: ModelsPage });

const VENDORS = [
  { id: "ALL", label: { zh: "全部厂商", en: "All vendors" } },
  { id: "OpenAI", label: { zh: "OpenAI", en: "OpenAI" } },
  { id: "Anthropic", label: { zh: "Anthropic", en: "Anthropic" } },
  { id: "DeepSeek", label: { zh: "DeepSeek", en: "DeepSeek" } },
  { id: "阿里巴巴", label: { zh: "阿里巴巴", en: "Alibaba" } },
  { id: "智谱", label: { zh: "智谱", en: "Zhipu" } },
  { id: "Moonshot", label: { zh: "Moonshot", en: "Moonshot" } },
  { id: "xAI", label: { zh: "xAI", en: "xAI" } },
];

function ModelsPage() {
  return (
    <SiteChrome orb={false}>
      <ModelsMarket />
    </SiteChrome>
  );
}

function ModelsMarket() {
  const { language } = useLanguage();
  const zh = language === "zh";

  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("ALL");
  const [tokenUnit, setTokenUnit] = useState<"1K" | "1M">("1K");
  const [copied, setCopied] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<ModelInfo | null>(null);
  const vendorWrapRef = useRef<HTMLDivElement>(null);
  const vendorScrollRef = useRef<HTMLDivElement>(null);
  const vendorTrackRef = useRef<HTMLDivElement>(null);
  const [vendorScroll, setVendorScroll] = useState({ overflow: true, atEnd: false });

  useEffect(() => {
    const wrap = vendorWrapRef.current;
    const scroll = vendorScrollRef.current;
    const track = vendorTrackRef.current;
    if (!wrap || !scroll || !track) return;

    const update = () => {
      const overflow = track.scrollWidth > wrap.clientWidth + 1;
      const atEnd = scroll.scrollLeft + scroll.clientWidth >= scroll.scrollWidth - 2;
      setVendorScroll((current) =>
        current.overflow === overflow && current.atEnd === atEnd
          ? current
          : { overflow, atEnd },
      );
    };

    const observer = new ResizeObserver(update);
    observer.observe(wrap);
    observer.observe(scroll);
    observer.observe(track);
    scroll.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      observer.disconnect();
      scroll.removeEventListener("scroll", update);
    };
  }, []);

  const scrollVendors = () => {
    const scroll = vendorScrollRef.current;
    if (!scroll) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    if (vendorScroll.atEnd) {
      scroll.scrollTo({ left: 0, behavior });
    } else {
      scroll.scrollBy({ left: Math.max(240, scroll.clientWidth * 0.75), behavior });
    }
  };

  const list = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return MODELS.filter((model) => {
      const providerMatch = provider === "ALL" || model.provider === provider;
      const searchMatch =
        !normalizedQuery ||
        [model.name, model.full, model.id, model.provider, ...(model.tags ?? [])].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      return providerMatch && searchMatch;
    });
  }, [provider, query]);

  const copyModelId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopied(id);
    window.setTimeout(() => setCopied((current) => (current === id ? null : current)), 1500);
  };

  return (
    <main className="site market">
      <div className="market-container">
        {/* Header matching prototype */}
        <header className="market-header-section">
          <div>
            <div className="market-eyebrow">
              <span className="market-eyebrow-dash" />
              <span>{zh ? "FOYTON 模型目录" : "FOYTON MODEL CATALOG"}</span>
            </div>
            <h1 className="market-hero-title">
              {zh ? "一目了然对比价格与可靠性" : "Compare price and reliability at a glance"}
            </h1>
            <p className="market-hero-sub">
              {zh
                ? "对比上下文、输入与输出价格以及线路可用性。复制任意模型 ID 即可开始构建。"
                : "Compare context, input and output pricing, and route availability. Copy any model ID and start building."}
            </p>
          </div>
          <div>
            <Link to="/docs/models" className="market-docs-btn" data-cursor="hover">
              <Code2 size={16} />
              <span>{zh ? "接入文档" : "Integration docs"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        {/* Toolbar matching prototype */}
        <section className="market-toolbar-wrap" aria-label={zh ? "模型筛选" : "Model filters"}>
          <div className="market-toolbar-top">
            <div className="market-vendors-wrap" ref={vendorWrapRef}>
              <div className="market-vendors-scroll" role="tablist" ref={vendorScrollRef}>
                <div className="market-vendors-track" ref={vendorTrackRef}>
                  {VENDORS.map((v) => {
                    const active = provider === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={cn("market-vendor-btn", active && "is-active")}
                        onClick={() => setProvider(v.id)}
                      >
                        {v.id === "ALL" ? (
                          <Sparkles size={14} />
                        ) : (
                          <ModelLogo name={v.id} size={17} />
                        )}
                        <span>{v.label[language]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {vendorScroll.overflow && (
                <button
                  type="button"
                  className={cn("market-vendors-more", vendorScroll.atEnd && "is-back")}
                  onClick={scrollVendors}
                >
                  <span>
                    {vendorScroll.atEnd
                      ? zh ? "返回前面" : "Back to first"
                      : zh ? "查看更多模型" : "More models"}
                  </span>
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="market-search-box">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                aria-label={zh ? "搜索模型" : "Search models"}
                placeholder={zh ? "搜索名称、ID 或能力" : "Search name, ID, or capability"}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="market-toolbar-sub">
            <div className="market-unit-wrap">
              <span>{zh ? "单位" : "Unit"}</span>
              <div className="market-unit-switcher" role="radiogroup">
                <button
                  type="button"
                  role="radio"
                  aria-checked={tokenUnit === "1M"}
                  className={cn("market-unit-btn", tokenUnit === "1M" && "is-active")}
                  onClick={() => setTokenUnit("1M")}
                >
                  1M
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={tokenUnit === "1K"}
                  className={cn("market-unit-btn", tokenUnit === "1K" && "is-active")}
                  onClick={() => setTokenUnit("1K")}
                >
                  1K
                </button>
              </div>
              <span className="market-count-label">
                {zh ? `${list.length} 个结果` : `${list.length} results`}
              </span>
            </div>
          </div>
        </section>

        {/* Comparison Table matching prototype exactly */}
        {list.length > 0 ? (
          <div className="market-table-card">
            {/* Header row */}
            <div className="market-grid-row market-table-header">
              <div className="market-th">{zh ? "模型" : "Model"}</div>
              <div className="market-th is-official">
                <span className="market-th-sub">{zh ? "官方" : "OFFICIAL"}</span>
                <span>{zh ? "输入价格" : "Input price"}</span>
              </div>
              <div className="market-th is-official">
                <span className="market-th-sub">{zh ? "官方" : "OFFICIAL"}</span>
                <span>{zh ? "输出价格" : "Output price"}</span>
              </div>
              <div className="market-th is-foyton-in">
                <span className="market-th-sub">FOYTON API</span>
                <span>{zh ? "输入价格" : "Input price"}</span>
              </div>
              <div className="market-th is-foyton-out">
                <span className="market-th-sub">FOYTON API</span>
                <span>{zh ? "输出价格" : "Output price"}</span>
              </div>
              <div className="market-th">{zh ? "可用性" : "Availability"}</div>
              <div className="market-th" style={{ textAlign: "right" }}>
                {zh ? "计费规则" : "Billing rules"}
              </div>
            </div>

            {/* Table Rows */}
            <div className="market-table-body">
              {list.map((model) => {
                const is1K = tokenUnit === "1K";
                const officialIn = is1K
                  ? model.officialInput1K ?? model.input
                  : model.officialInput1M ?? model.input;
                const officialOut = is1K
                  ? model.officialOutput1K ?? model.output
                  : model.officialOutput1M ?? model.output;
                const foytonIn = is1K
                  ? model.foytonInput1K ?? model.input
                  : model.foytonInput1M ?? model.input;
                const foytonOut = is1K
                  ? model.foytonOutput1K ?? model.output
                  : model.foytonOutput1M ?? model.output;
                const cachedPrice = is1K ? model.cached1K : model.cached1M;
                const unitSuffix = is1K ? "/ 1K" : "/ 1M";

                return (
                  <article key={model.id} className="market-grid-row market-row">
                    {/* Col 1: Model info */}
                    <div className="market-cell market-model-info">
                      <div className="market-model-icon-box">
                        <ModelLogo name={model.provider} size={20} />
                      </div>
                      <div className="market-model-text">
                        <div className="market-model-heading">
                          <button type="button" className="market-model-name market-model-name-button" onClick={() => setActiveModel(model)}>{model.full}</button>
                          <span className="market-provider-tag">{model.provider}</span>
                        </div>
                        <div className="market-model-id-row">
                          <code>{model.id}</code>
                          <button
                            type="button"
                            className="market-copy-btn"
                            onClick={() => copyModelId(model.id)}
                            aria-label={zh ? `复制模型 ID ${model.id}` : `Copy ${model.id}`}
                            title={zh ? "复制模型 ID" : "Copy model ID"}
                          >
                            {copied === model.id ? (
                              <Check size={13} color="#16a34a" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Official Input Price */}
                    <div className="market-cell">
                      <div>
                        <span className="market-price-official">{officialIn}</span>
                        {officialIn !== "—" && (
                          <span className="market-price-unit">{unitSuffix}</span>
                        )}
                      </div>
                    </div>

                    {/* Col 3: Official Output Price */}
                    <div className="market-cell">
                      <div>
                        <span className="market-price-official">{officialOut}</span>
                        {officialOut !== "—" && (
                          <span className="market-price-unit">{unitSuffix}</span>
                        )}
                      </div>
                    </div>

                    {/* Col 4: FOYTON API Input Price */}
                    <div className="market-cell is-foyton-in">
                      <div className="market-foyton-price-row">
                        <span className="market-price-foyton">{foytonIn}</span>
                        {model.discount && (
                          <span className="market-discount-badge"><span className="market-discount-flame" aria-hidden="true">🔥</span>{model.discount}</span>
                        )}
                      </div>
                      {foytonIn !== "—" && (
                        <span className="market-price-unit-sub">{unitSuffix}</span>
                      )}
                      <div className="market-price-tip">
                        <CircleHelp size={12} />
                        <span>{zh ? "按实际 Token 计费" : "Billed by actual tokens"}</span>
                      </div>
                      {cachedPrice && cachedPrice !== "—" && (
                        <div className="market-price-cached">
                          <span>{zh ? "缓存 " : "Cached "}</span>
                          <strong>{cachedPrice}</strong>
                          <span> {unitSuffix}</span>
                        </div>
                      )}
                    </div>

                    {/* Col 5: FOYTON API Output Price */}
                    <div className="market-cell is-foyton-out">
                      <div className="market-foyton-price-row">
                        <span className="market-price-foyton">{foytonOut}</span>
                        {model.discount && (
                          <span className="market-discount-badge"><span className="market-discount-flame" aria-hidden="true">🔥</span>{model.discount}</span>
                        )}
                      </div>
                      {foytonOut !== "—" && (
                        <span className="market-price-unit-sub">{unitSuffix}</span>
                      )}
                      <div className="market-price-latency">
                        <Zap size={12} />
                        <span>
                          {zh ? "典型延迟 " : "Typical latency "}
                          {model.latency}
                        </span>
                      </div>
                    </div>

                    {/* Col 6: Availability */}
                    <div className="market-cell">
                      <div className="market-availability-wrap">
                        <div className="market-availability-num">
                          <span>{(model.availability ?? 99.9).toFixed(2)}%</span>
                          <span className="market-avail-dot" />
                        </div>
                        {/* 24 green status bars */}
                        <div className="market-bars-row" aria-hidden="true">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <span key={i} className="market-bar-item" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Col 7: Actions */}
                    <div className="market-cell">
                      <div className="market-actions-row">
                        <button
                          type="button"
                          className="market-billing-action"
                          onClick={() => setActiveModel(model)}
                          aria-label={zh ? `查看 ${model.full} 计费规则` : `View billing rules for ${model.full}`}
                          data-cursor="hover"
                        >
                          <span className="market-billing-action-label">{zh ? "计费规则" : "Pricing"}</span>
                          <ArrowRight size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="market-table-card market-empty">
            <p>{zh ? "没有找到符合条件的模型。" : "No matching models."}</p>
          </div>
        )}

        {/* Footer info matching prototype */}
        <div className="market-footer-bar">
          <p>
            {zh
              ? "页面价格为当前参考价，实际结算以控制台账单为准。"
              : "Displayed prices are current references. Console billing is authoritative."}
          </p>
          <Link to="/docs/models" className="market-footer-link">
            {zh ? "查看计费指南" : "View billing guide"} <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {activeModel && (
        <ModelDetailsDialog
          model={activeModel}
          tokenUnit={tokenUnit}
          language={language}
          onClose={() => setActiveModel(null)}
        />
      )}

      <SiteFooter />
    </main>
  );
}
