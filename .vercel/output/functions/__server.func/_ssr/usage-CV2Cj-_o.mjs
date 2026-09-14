import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { a as formatTokens, l as getUsage, o as formatYuan } from "./format-C25qNRUT.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/usage-CV2Cj-_o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UsagePage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getUsage().then(setData).catch(() => setFailed(true));
	}, []);
	const chart = data?.days.map((d) => ({
		day: d.day.slice(5),
		tokens: d.input_tokens + d.output_tokens
	})) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "console-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-kicker",
				children: "Telemetry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "console-title",
				children: "Token usage"
			}),
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted",
				children: "Unable to load usage."
			}) : data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "console-stats",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatTokens(data.total) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Input" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatTokens(data.input) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Output" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatTokens(data.output) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatYuan(data.cost) })] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "usage-chart",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: chart,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								tickLine: false,
								axisLine: false,
								tick: {
									fill: "#92969D",
									fontSize: 11
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active: tipOn, payload, label }) => {
								if (!tipOn || !payload?.[0]) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "chart-tip glass",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatTokens(Number(payload[0].value)) })]
								});
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "tokens",
								stroke: active == null ? "#111214" : "#A9DDE0",
								strokeWidth: 1.25,
								dot: false,
								activeDot: {
									r: 3,
									fill: "#A9DDE0",
									stroke: "none"
								},
								onMouseMove: () => setActive(1),
								onMouseLeave: () => setActive(null)
							})
						]
					})
				})
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted",
				children: "Loading usage…"
			})
		]
	});
}
//#endregion
export { UsagePage as component };
