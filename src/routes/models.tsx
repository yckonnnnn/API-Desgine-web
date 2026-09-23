import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ModelLogo } from "@/components/models/model-logo";
import { SiteFooter } from "@/components/sections/site-footer";
import { useLanguage } from "@/lib/language";
import { MODEL_FILTERS, MODELS, type ModelCategory } from "@/lib/models";
import { USD_SYMBOL } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/models")({ component: ModelsPage });

const CATEGORY_LABELS: Record<ModelCategory, { zh: string; en: string }> = {
  ALL: { zh: "全部类型", en: "All types" },
  CHAT: { zh: "通用对话", en: "Chat" },
  REASONING: { zh: "深度推理", en: "Reasoning" },
  CODE: { zh: "代码", en: "Code" },
  VISION: { zh: "视觉", en: "Vision" },
  IMAGE: { zh: "图像", en: "Image" },
  AUDIO: { zh: "音频", en: "Audio" },
};

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
  const [category, setCategory] = useState<ModelCategory>("ALL");
  const [provider, setProvider] = useState("ALL");
  const [copied, setCopied] = useState<string | null>(null);

  const providers = useMemo(() => ["ALL", ...new Set(MODELS.map((model) => model.provider))], []);
  const list = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return MODELS.filter((model) => {
      const categoryMatch = category === "ALL" || model.category === category;
      const providerMatch = provider === "ALL" || model.provider === provider;
      const searchMatch = !normalizedQuery || [model.name, model.full, model.id, model.provider]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      return categoryMatch && providerMatch && searchMatch;
    });
  }, [category, provider, query]);

  const copyModelId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopied(id);
    window.setTimeout(() => setCopied((current) => current === id ? null : current), 1400);
  };

  return (
      <main className="site market">
        <header className="market-head">
          <p className="section-kicker">Foyton Model Catalog</p>
          <div className="market-intro">
            <h1 className="market-title">{zh ? "模型广场" : "Model square"}</h1>
            <p>{zh ? "比较模型能力、价格与线路表现，选择最适合你的智能入口。" : "Compare capabilities, pricing, and route performance in one place."}</p>
          </div>
        </header>

        <section className="market-toolbar" aria-label={zh ? "模型筛选" : "Model filters"}>
          <div className="provider-filters">
            {providers.map((item) => (
              <button key={item} type="button" className={cn("provider-chip", provider === item && "is-on")} onClick={() => setProvider(item)}>
                {item === "ALL" ? (zh ? "全部品牌" : "All providers") : item}
              </button>
            ))}
          </div>
          <label className="market-search-wrap">
            <Search aria-hidden="true" />
            <input className="market-search" type="search" placeholder={zh ? "搜索名称、模型 ID 或品牌" : "Search name, model ID, or provider"} value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="market-filter-row">
            <div className="market-filters">
              {MODEL_FILTERS.map((item) => (
                <button key={item} type="button" className={cn("filter-chip", category === item && "is-on")} onClick={() => setCategory(item)}>
                  {CATEGORY_LABELS[item][language]}
                </button>
              ))}
            </div>
            <span className="market-count">{zh ? `${list.length} 个结果` : `${list.length} results`}</span>
          </div>
        </section>

        <section className="market-grid" aria-live="polite">
          {list.map((model) => (
            <article key={model.id} className={cn("model-tile", model.featured && "is-featured")}>
              <div className="tile-head">
                <span className="tile-logo"><ModelLogo name={model.name} /></span>
                <div>
                  <p className="tile-provider">{model.provider}</p>
                  <h2>{model.full}</h2>
                </div>
                <span className="tile-availability"><i />{zh ? "99.9% 可用" : "99.9% available"}</span>
              </div>
              <button type="button" className="model-id" onClick={() => copyModelId(model.id)} aria-label={zh ? `复制模型 ID ${model.id}` : `Copy model ID ${model.id}`}>
                <code>{model.id}</code>
                {copied === model.id ? <Check /> : <Copy />}
              </button>
              <div className="tile-tags"><span>{CATEGORY_LABELS[model.category][language]}</span><span>{model.context} Context</span></div>
              <dl>
                <div><dt>{zh ? "输入价格" : "Input"}</dt><dd>{model.input.replace("$", USD_SYMBOL)} / 1M</dd></div>
                <div><dt>{zh ? "输出价格" : "Output"}</dt><dd>{model.output.replace("$", USD_SYMBOL)} / 1M</dd></div>
                <div><dt>{zh ? "典型延迟" : "Latency"}</dt><dd>{model.latency}</dd></div>
                <div><dt>{zh ? "上下文" : "Context"}</dt><dd>{model.context}</dd></div>
              </dl>
              <Link to="/login" className="tile-use" data-cursor="hover">{zh ? `接入 ${model.full}` : `Use ${model.full}`}</Link>
            </article>
          ))}
          {list.length === 0 ? <p className="market-empty">{zh ? "没有找到符合条件的模型。" : "No matching models."}</p> : null}
        </section>
        <p className="market-note">{zh ? "页面价格为当前参考价，实际结算以控制台账单为准。" : "Prices are indicative. Final billing follows the console statement."}</p>
        <SiteFooter />
      </main>
  );
}
