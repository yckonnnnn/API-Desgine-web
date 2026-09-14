import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as SiteFooter, i as SiteChrome, n as MODEL_FILTERS, t as MODELS } from "./site-footer-CD4n_h6o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/models-D6C-Sgqp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ModelsPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("ALL");
	const list = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return MODELS.filter((m) => {
			const cat = filter === "ALL" || m.category === filter;
			const text = !q || m.name.toLowerCase().includes(q) || m.full.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q);
			return cat && text;
		});
	}, [query, filter]);
	const featured = list.filter((m) => m.featured);
	const rest = list.filter((m) => !m.featured);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, {
		orb: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "site market",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "market-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "section-kicker",
							children: "Models"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "section-title",
							children: "Explore the intelligence layer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "glass-input market-search",
							type: "search",
							placeholder: "Search models",
							value: query,
							onChange: (e) => setQuery(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "market-filters",
							children: MODEL_FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-cursor": "hover",
								className: cn("filter-chip", filter === item && "is-on"),
								onClick: () => setFilter(item),
								children: item
							}, item))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "market-grid",
					children: [
						featured.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "model-tile is-featured",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tile-provider",
									children: model.provider
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: model.full }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tile-cat",
									children: model.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Context" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: model.context })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Input" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: model.input })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Output" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: model.output })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Latency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: model.latency })] })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "tile-use",
									"data-cursor": "hover",
									children: "Use model"
								})
							]
						}, model.full)),
						rest.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "model-tile",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tile-provider",
									children: model.provider
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: model.full }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tile-cat",
									children: model.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Context" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: model.context })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Input" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: model.input })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Output" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: model.output })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Latency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: model.latency })] })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "tile-use",
									"data-cursor": "hover",
									children: "Use model"
								})
							]
						}, model.full)),
						list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "market-empty",
							children: "No models in this layer yet."
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		})
	});
}
//#endregion
export { ModelsPage as component };
