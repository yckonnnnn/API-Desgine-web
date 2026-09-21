import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const [wallet] = await sql<{
      balance_cents: number;
      requests: number;
      success_bps: number;
    }>`
      select balance_cents, requests, success_bps from wallets where user_id = ${context.userId}
    `;
    const today = new Date().toISOString().slice(0, 10);
    const [todayRow] = await sql<{ cost_cents: number }>`
      select coalesce(sum(cost_cents), 0)::int as cost_cents
      from usage_days
      where user_id = ${context.userId} and day = ${today}::date
    `;
    const [tokenRow] = await sql<{ input: number; output: number }>`
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
      successBps: wallet?.success_bps ?? 9998,
    };
  });

export const listKeys = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    return sql<{
      id: string;
      name: string;
      last4: string;
      disabled: boolean;
      created_at: string;
    }>`
      select id, name, last4, disabled, created_at
      from api_keys
      where user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const createKey = createServerFn({ method: "POST" })
  .validator((name: string) => name.trim() || "Untitled")
  .middleware([authMiddleware])
  .handler(async ({ context, data: name }) => {
    const { ensureAccount, newApiSecret } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const { secret, last4, id } = await newApiSecret();
    await sql`
      insert into api_keys (id, user_id, name, last4, disabled)
      values (${id}, ${context.userId}, ${name}, ${last4}, false)
    `;
    return { id, name, last4, secret };
  });

export const disableKey = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      update api_keys
      set disabled = not disabled
      where id = ${id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const renameKey = createServerFn({ method: "POST" })
  .validator((input: { id: string; name: string }) => ({
    id: input.id,
    name: input.name.trim() || "Untitled",
  }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      update api_keys
      set name = ${data.name}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const getWallet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const [row] = await sql<{ balance_cents: number }>`
      select balance_cents from wallets where user_id = ${context.userId}
    `;
    return { balanceCents: row?.balance_cents ?? 0 };
  });

export const addFunds = createServerFn({ method: "POST" })
  // Whole yuan within a sane band. The wallet offers preset steps plus a custom
  // field, so the previous fixed-list check rejected every custom amount.
  .validator((yuanAmount: number) => {
    const yuan = Math.floor(Number(yuanAmount));
    if (!Number.isFinite(yuan) || yuan < 1 || yuan > 100_000) {
      throw new Error("Invalid amount");
    }
    return yuan;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data: yuanAmount }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const cents = yuanAmount * 100;
    await sql`
      update wallets
      set balance_cents = balance_cents + ${cents}
      where user_id = ${context.userId}
    `;
    const [row] = await sql<{ balance_cents: number }>`
      select balance_cents from wallets where user_id = ${context.userId}
    `;
    return { balanceCents: row?.balance_cents ?? 0 };
  });

export const getUsage = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const days = await sql<{
      day: string;
      input_tokens: number;
      output_tokens: number;
      cost_cents: number;
    }>`
      select day::text as day, input_tokens, output_tokens, cost_cents
      from usage_days
      where user_id = ${context.userId}
      order by day asc
    `;
    const input = days.reduce((s, d) => s + d.input_tokens, 0);
    const output = days.reduce((s, d) => s + d.output_tokens, 0);
    const cost = days.reduce((s, d) => s + d.cost_cents, 0);
    return { days, input, output, cost, total: input + output };
  });

export const getBilling = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    return sql<{
      id: number;
      created_at: string;
      model: string;
      api_key_last4: string;
      input_tokens: number;
      output_tokens: number;
      cost_cents: number;
      status: string;
    }>`
      select id, created_at, model, api_key_last4, input_tokens, output_tokens, cost_cents, status
      from billing_rows
      where user_id = ${context.userId}
      order by created_at desc
      limit 40
    `;
  });
