import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Caf579Hy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-C25qNRUT.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6f23289d23670d5aed8a9ba3bbb087b89b2ac847a87ec8c274f10b49b37162ca"));
var listKeys = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f053fea59b43c9de827c0f09fb08cce41b0ac885e0d6c9b9e676d275fdeb8dc8"));
var createKey = createServerFn({ method: "POST" }).validator((name) => name.trim() || "Untitled").middleware([authMiddleware]).handler(createSsrRpc("d88045b22281433ae7300ad6746183e9e3f7a4f9d2c6e57e847fed4f009409fc"));
var disableKey = createServerFn({ method: "POST" }).validator((id) => id).middleware([authMiddleware]).handler(createSsrRpc("17b3da7caf65a702bddb5dd9d51aadb33aca683a9e763cc1b8494372d0b2de85"));
var renameKey = createServerFn({ method: "POST" }).validator((input) => ({
	id: input.id,
	name: input.name.trim() || "Untitled"
})).middleware([authMiddleware]).handler(createSsrRpc("40ae178043ce3efa75e1a461e933a2337d0d2b664645d6ce4aa77dc335061063"));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d429f2c77262bf10660df98a8dcbbfd428e7094f70d760bd9e68c35e5d745058"));
var addFunds = createServerFn({ method: "POST" }).validator((yuanAmount) => {
	if (![
		50,
		100,
		200,
		500,
		1e3
	].includes(yuanAmount)) throw new Error("Invalid amount");
	return yuanAmount;
}).middleware([authMiddleware]).handler(createSsrRpc("547c396a7902e95db724f0466ef71c4af48983d485012f17f347860a22d332c1"));
var getUsage = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0723921f92b9c7d43e6bb4d5319165c044b24239c9fd9ba082fb09c5ac5ae04c"));
var getBilling = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2991761fe7a61327c0e75169cd62c9a4e817281f61873f40f8ec4fef05207294"));
function formatYuan(cents) {
	return new Intl.NumberFormat("zh-CN", {
		style: "currency",
		currency: "CNY",
		minimumFractionDigits: 2
	}).format(cents / 100);
}
function formatTokens(n) {
	if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
	return String(n);
}
function formatNumber(n) {
	return new Intl.NumberFormat("en-US").format(n);
}
function maskKey(last4) {
	return `sk-fyt-••••••••${last4}`;
}
//#endregion
export { formatTokens as a, getDashboard as c, listKeys as d, maskKey as f, formatNumber as i, getUsage as l, createKey as n, formatYuan as o, renameKey as p, disableKey as r, getBilling as s, addFunds as t, getWallet as u };
