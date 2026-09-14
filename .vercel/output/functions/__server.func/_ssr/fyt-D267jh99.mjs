import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Caf579Hy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fyt-D267jh99.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getDashboard_createServerFn_handler = createServerRpc({
	id: "6f23289d23670d5aed8a9ba3bbb087b89b2ac847a87ec8c274f10b49b37162ca",
	name: "getDashboard",
	filename: "src/lib/fyt.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const { ensureAccount } = await import("./fyt-data.server-CQq3B5JY.mjs");
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await ensureAccount(context.userId);
	const sql = await getSql();
	const [wallet] = await sql`
      select balance_cents, requests, success_bps from wallets where user_id = ${context.userId}
    `;
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const [todayRow] = await sql`
      select coalesce(sum(cost_cents), 0)::int as cost_cents
      from usage_days
      where user_id = ${context.userId} and day = ${today}::date
    `;
	const [tokenRow] = await sql`
      select
        coalesce(sum(input_tokens), 0)::int as input,
        coalesce(sum(output_tokens), 0)::int as output
      from usage_days
      where user_id = ${context.userId}
    `;
	return {
		balanceCents: wallet?.balance_cents ?? 0,
		todaySpendCents: todayRow?.cost_cents ?? 0,
		requests: wallet?.requests ?? 0,
		tokens: (tokenRow?.input ?? 0) + (tokenRow?.output ?? 0),
		successBps: wallet?.success_bps ?? 9998
	};
});
var listKeys_createServerFn_handler = createServerRpc({
	id: "f053fea59b43c9de827c0f09fb08cce41b0ac885e0d6c9b9e676d275fdeb8dc8",
	name: "listKeys",
	filename: "src/lib/fyt.ts"
}, (opts) => listKeys.__executeServer(opts));
var listKeys = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listKeys_createServerFn_handler, async ({ context }) => {
	const { ensureAccount } = await import("./fyt-data.server-CQq3B5JY.mjs");
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await ensureAccount(context.userId);
	return (await getSql())`
      select id, name, last4, disabled, created_at
      from api_keys
      where user_id = ${context.userId}
      order by created_at desc
    `;
});
var createKey_createServerFn_handler = createServerRpc({
	id: "d88045b22281433ae7300ad6746183e9e3f7a4f9d2c6e57e847fed4f009409fc",
	name: "createKey",
	filename: "src/lib/fyt.ts"
}, (opts) => createKey.__executeServer(opts));
var createKey = createServerFn({ method: "POST" }).validator((name) => name.trim() || "Untitled").middleware([authMiddleware]).handler(createKey_createServerFn_handler, async ({ context, data: name }) => {
	const { ensureAccount, newApiSecret } = await import("./fyt-data.server-CQq3B5JY.mjs");
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await ensureAccount(context.userId);
	const sql = await getSql();
	const { secret, last4, id } = await newApiSecret();
	await sql`
      insert into api_keys (id, user_id, name, last4, disabled)
      values (${id}, ${context.userId}, ${name}, ${last4}, false)
    `;
	return {
		id,
		name,
		last4,
		secret
	};
});
var disableKey_createServerFn_handler = createServerRpc({
	id: "17b3da7caf65a702bddb5dd9d51aadb33aca683a9e763cc1b8494372d0b2de85",
	name: "disableKey",
	filename: "src/lib/fyt.ts"
}, (opts) => disableKey.__executeServer(opts));
var disableKey = createServerFn({ method: "POST" }).validator((id) => id).middleware([authMiddleware]).handler(disableKey_createServerFn_handler, async ({ context, data: id }) => {
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
      update api_keys
      set disabled = not disabled
      where id = ${id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var renameKey_createServerFn_handler = createServerRpc({
	id: "40ae178043ce3efa75e1a461e933a2337d0d2b664645d6ce4aa77dc335061063",
	name: "renameKey",
	filename: "src/lib/fyt.ts"
}, (opts) => renameKey.__executeServer(opts));
var renameKey = createServerFn({ method: "POST" }).validator((input) => ({
	id: input.id,
	name: input.name.trim() || "Untitled"
})).middleware([authMiddleware]).handler(renameKey_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
      update api_keys
      set name = ${data.name}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var getWallet_createServerFn_handler = createServerRpc({
	id: "d429f2c77262bf10660df98a8dcbbfd428e7094f70d760bd9e68c35e5d745058",
	name: "getWallet",
	filename: "src/lib/fyt.ts"
}, (opts) => getWallet.__executeServer(opts));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getWallet_createServerFn_handler, async ({ context }) => {
	const { ensureAccount } = await import("./fyt-data.server-CQq3B5JY.mjs");
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await ensureAccount(context.userId);
	const [row] = await (await getSql())`
      select balance_cents from wallets where user_id = ${context.userId}
    `;
	return { balanceCents: row?.balance_cents ?? 0 };
});
var addFunds_createServerFn_handler = createServerRpc({
	id: "547c396a7902e95db724f0466ef71c4af48983d485012f17f347860a22d332c1",
	name: "addFunds",
	filename: "src/lib/fyt.ts"
}, (opts) => addFunds.__executeServer(opts));
var addFunds = createServerFn({ method: "POST" }).validator((yuanAmount) => {
	if (![
		50,
		100,
		200,
		500,
		1e3
	].includes(yuanAmount)) throw new Error("Invalid amount");
	return yuanAmount;
}).middleware([authMiddleware]).handler(addFunds_createServerFn_handler, async ({ context, data: yuanAmount }) => {
	const { ensureAccount } = await import("./fyt-data.server-CQq3B5JY.mjs");
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await ensureAccount(context.userId);
	const sql = await getSql();
	await sql`
      update wallets
      set balance_cents = balance_cents + ${yuanAmount * 100}
      where user_id = ${context.userId}
    `;
	const [row] = await sql`
      select balance_cents from wallets where user_id = ${context.userId}
    `;
	return { balanceCents: row?.balance_cents ?? 0 };
});
var getUsage_createServerFn_handler = createServerRpc({
	id: "0723921f92b9c7d43e6bb4d5319165c044b24239c9fd9ba082fb09c5ac5ae04c",
	name: "getUsage",
	filename: "src/lib/fyt.ts"
}, (opts) => getUsage.__executeServer(opts));
var getUsage = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getUsage_createServerFn_handler, async ({ context }) => {
	const { ensureAccount } = await import("./fyt-data.server-CQq3B5JY.mjs");
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await ensureAccount(context.userId);
	const days = await (await getSql())`
      select day::text as day, input_tokens, output_tokens, cost_cents
      from usage_days
      where user_id = ${context.userId}
      order by day asc
    `;
	const input = days.reduce((s, d) => s + d.input_tokens, 0);
	const output = days.reduce((s, d) => s + d.output_tokens, 0);
	return {
		days,
		input,
		output,
		cost: days.reduce((s, d) => s + d.cost_cents, 0),
		total: input + output
	};
});
var getBilling_createServerFn_handler = createServerRpc({
	id: "2991761fe7a61327c0e75169cd62c9a4e817281f61873f40f8ec4fef05207294",
	name: "getBilling",
	filename: "src/lib/fyt.ts"
}, (opts) => getBilling.__executeServer(opts));
var getBilling = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getBilling_createServerFn_handler, async ({ context }) => {
	const { ensureAccount } = await import("./fyt-data.server-CQq3B5JY.mjs");
	const { getSql } = await import("./db-Vei3JKfW.mjs").then((n) => n.t).then((n) => n.t);
	await ensureAccount(context.userId);
	return (await getSql())`
      select id, created_at, model, api_key_last4, input_tokens, output_tokens, cost_cents, status
      from billing_rows
      where user_id = ${context.userId}
      order by created_at desc
      limit 40
    `;
});
//#endregion
export { addFunds_createServerFn_handler, createKey_createServerFn_handler, disableKey_createServerFn_handler, getBilling_createServerFn_handler, getDashboard_createServerFn_handler, getUsage_createServerFn_handler, getWallet_createServerFn_handler, listKeys_createServerFn_handler, renameKey_createServerFn_handler };
