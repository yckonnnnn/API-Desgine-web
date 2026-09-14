import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { f as maskKey, i as formatNumber, o as formatYuan, s as getBilling } from "./format-C25qNRUT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-CU0st-jW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BillingPage() {
	const [rows, setRows] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getBilling().then(setRows).catch(() => setRows([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "console-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-kicker",
				children: "Ledger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "console-title",
				children: "Billing"
			}),
			rows == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted",
				children: "Loading ledger…"
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted",
				children: "No charges yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-scroll",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "quiet-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Time" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Model" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "API Key" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Input" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Output" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Cost" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(row.created_at).toLocaleString() }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.model }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "mono",
							children: maskKey(row.api_key_last4)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatNumber(row.input_tokens) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatNumber(row.output_tokens) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatYuan(row.cost_cents) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.status === "ok" ? "OK" : row.status })
					] }, row.id)) })]
				})
			})
		]
	});
}
//#endregion
export { BillingPage as component };
