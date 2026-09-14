import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { a as formatTokens, c as getDashboard, i as formatNumber, o as formatYuan } from "./format-C25qNRUT.mjs";
import { t as useCurrentUser } from "./use-current-user-ClOiUQ-z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-BRdadTMk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const user = useCurrentUser();
	const [data, setData] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getDashboard().then(setData).catch(() => setFailed(true));
	}, []);
	const name = user?.displayName?.split(" ")[0] ?? "there";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "console-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-kicker",
				children: "Console"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "console-hello",
				children: [
					"Welcome back, ",
					name,
					"."
				]
			}),
			failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted",
				children: "Unable to load workspace."
			}) : data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "console-balance",
					children: formatYuan(data.balanceCents)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "console-balance-label",
					children: "Balance"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "console-stats",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Today spend" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatYuan(data.todaySpendCents) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Requests" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatNumber(data.requests) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tokens" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatTokens(data.tokens) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [(data.successBps / 100).toFixed(2), "%"] })] })
					]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted",
				children: "Loading workspace…"
			})
		]
	});
}
//#endregion
export { Overview as component };
