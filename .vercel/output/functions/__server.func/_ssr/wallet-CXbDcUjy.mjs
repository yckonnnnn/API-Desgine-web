import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { o as formatYuan, t as addFunds, u as getWallet } from "./format-C25qNRUT.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-CXbDcUjy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AMOUNTS = [
	50,
	100,
	200,
	500,
	1e3
];
function WalletPage() {
	const [balance, setBalance] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)(100);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getWallet().then((w) => setBalance(w.balanceCents)).catch(() => setBalance(0));
	}, []);
	const index = AMOUNTS.indexOf(amount);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "console-page wallet-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-kicker",
				children: "Wallet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "console-title",
				children: "Balance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-balance",
				children: balance == null ? "—" : formatYuan(balance)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "amount-label",
				children: "Add funds"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "amount-track",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "amount-liquid",
					style: { transform: `translateX(${index * 100}%)` }
				}), AMOUNTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cn("amount-btn", amount === item && "is-on"),
					onClick: () => setAmount(item),
					children: ["¥", item]
				}, item))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-ink",
				disabled: busy,
				onClick: () => {
					setBusy(true);
					setNote(null);
					addFunds({ data: amount }).then((w) => {
						setBalance(w.balanceCents);
						setNote(`Added ${formatYuan(amount * 100)}.`);
					}).catch(() => setNote("Unable to add funds.")).finally(() => setBusy(false));
				},
				children: busy ? "Adding…" : "Add funds"
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "console-muted wallet-note",
				children: note
			}) : null
		]
	});
}
//#endregion
export { WalletPage as component };
