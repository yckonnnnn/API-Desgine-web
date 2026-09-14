import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteFooter } from "@/components/sections/site-footer";
import { MODEL_FILTERS, MODELS, type ModelCategory } from "@/lib/models";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/models")({ component: ModelsPage });

function ModelsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ModelCategory>("ALL");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODELS.filter((m) => {
      const cat = filter === "ALL" || m.category === filter;
      const text =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.full.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q);
      return cat && text;
    });
  }, [query, filter]);

  const featured = list.filter((m) => m.featured);
  const rest = list.filter((m) => !m.featured);

  return (
    <SiteChrome orb={false}>
      <main className="site market">
        <header className="market-head">
          <p className="section-kicker">Models</p>
          <h1 className="section-title">Explore the intelligence layer.</h1>
          <input
            className="glass-input market-search"
            type="search"
            placeholder="Search models"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="market-filters">
            {MODEL_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                data-cursor="hover"
                className={cn("filter-chip", filter === item && "is-on")}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </header>
        <div className="market-grid">
          {featured.map((model) => (
            <article key={model.full} className="model-tile is-featured">
              <p className="tile-provider">{model.provider}</p>
              <h2>{model.full}</h2>
              <p className="tile-cat">{model.category}</p>
              <dl>
                <div>
                  <dt>Context</dt>
                  <dd>{model.context}</dd>
                </div>
                <div>
                  <dt>Input</dt>
                  <dd>{model.input}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>{model.output}</dd>
                </div>
                <div>
                  <dt>Latency</dt>
                  <dd>{model.latency}</dd>
                </div>
              </dl>
              <Link to="/login" className="tile-use" data-cursor="hover">
                Use model
              </Link>
            </article>
          ))}
          {rest.map((model) => (
            <article key={model.full} className="model-tile">
              <p className="tile-provider">{model.provider}</p>
              <h2>{model.full}</h2>
              <p className="tile-cat">{model.category}</p>
              <dl>
                <div>
                  <dt>Context</dt>
                  <dd>{model.context}</dd>
                </div>
                <div>
                  <dt>Input</dt>
                  <dd>{model.input}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>{model.output}</dd>
                </div>
                <div>
                  <dt>Latency</dt>
                  <dd>{model.latency}</dd>
                </div>
              </dl>
              <Link to="/login" className="tile-use" data-cursor="hover">
                Use model
              </Link>
            </article>
          ))}
          {list.length === 0 ? (
            <p className="market-empty">No models in this layer yet.</p>
          ) : null}
        </div>
        <SiteFooter />
      </main>
    </SiteChrome>
  );
}
