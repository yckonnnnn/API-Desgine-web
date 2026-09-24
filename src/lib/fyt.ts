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

/** Aggregate platform metrics for the admin analytics view. */
export const getPlatformAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { ensureAnalyticsData } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const [admin] = await sql<{ email: string | null }>`
      select email from "user" where id = ${context.userId}
    `;
    if (admin?.email !== "admin@fyt.local") throw new Error("Forbidden");

    await ensureAnalyticsData();

    const [userStats] = await sql<{ total: number; today: number; yesterday: number }>`
      select
        count(*)::int as total,
        count(*) filter (where "createdAt" >= date_trunc('day', now()))::int as today,
        count(*) filter (
          where "createdAt" >= date_trunc('day', now()) - interval '1 day'
            and "createdAt" < date_trunc('day', now())
        )::int as yesterday
      from "user"
    `;

    const [payStats] = await sql<{
      total_cents: number;
      today_cents: number;
      yesterday_cents: number;
      today_users: number;
      yesterday_users: number;
    }>`
      select
        coalesce(sum(amount_cents), 0)::int as total_cents,
        coalesce(sum(amount_cents) filter (where created_at >= date_trunc('day', now())), 0)::int as today_cents,
        coalesce(sum(amount_cents) filter (
          where created_at >= date_trunc('day', now()) - interval '1 day'
            and created_at < date_trunc('day', now())
        ), 0)::int as yesterday_cents,
        count(distinct user_id) filter (where created_at >= date_trunc('day', now()))::int as today_users,
        count(distinct user_id) filter (
          where created_at >= date_trunc('day', now()) - interval '1 day'
            and created_at < date_trunc('day', now())
        )::int as yesterday_users
      from payments
    `;

    const days = await sql<{
      day: string;
      full_date: string;
      users: number;
      paying_users: number;
      paid_cents: number;
      paid_amount: number;
    }>`
      with date_series as (
        select date_trunc('day', now() - (n || ' days')::interval) as day_date
        from generate_series(6, 0, -1) as n
      ),
      user_counts as (
        select date_trunc('day', "createdAt") as day_date, count(*)::int as users
        from "user"
        where "createdAt" >= date_trunc('day', now()) - interval '6 days'
        group by date_trunc('day', "createdAt")
      ),
      pay_counts as (
        select
          date_trunc('day', created_at) as day_date,
          count(distinct user_id)::int as paying_users,
          coalesce(sum(amount_cents), 0)::int as paid_cents
        from payments
        where created_at >= date_trunc('day', now()) - interval '6 days'
        group by date_trunc('day', created_at)
      )
      select
        to_char(ds.day_date, 'MM-DD') as day,
        to_char(ds.day_date, 'YYYY-MM-DD') as full_date,
        coalesce(uc.users, 0)::int as users,
        coalesce(pc.paying_users, 0)::int as paying_users,
        coalesce(pc.paid_cents, 0)::int as paid_cents,
        round(coalesce(pc.paid_cents, 0) / 100.0, 2)::float as paid_amount
      from date_series ds
      left join user_counts uc on uc.day_date = ds.day_date
      left join pay_counts pc on pc.day_date = ds.day_date
      order by ds.day_date asc
    `;

    return {
      totalUsers: userStats?.total ?? 0,
      todayUsers: userStats?.today ?? 0,
      yesterdayUsers: userStats?.yesterday ?? 0,
      todayPayingUsers: payStats?.today_users ?? 0,
      yesterdayPayingUsers: payStats?.yesterday_users ?? 0,
      todayPaidCents: payStats?.today_cents ?? 0,
      yesterdayPaidCents: payStats?.yesterday_cents ?? 0,
      totalPaidCents: payStats?.total_cents ?? 0,
      days: days.map((d) => ({
        day: d.day,
        fullDate: d.full_date,
        users: d.users,
        payingUsers: d.paying_users,
        paidCents: d.paid_cents,
        paidAmount: d.paid_amount,
      })),
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
  // Whole dollars within a sane band. The wallet offers preset steps plus a
  // custom field, so the previous fixed-list check rejected every custom amount.
  .validator((dollarAmount: number) => {
    const dollars = Math.floor(Number(dollarAmount));
    if (!Number.isFinite(dollars) || dollars < 1 || dollars > 100_000) {
      throw new Error("Invalid amount");
    }
    return dollars;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data: dollarAmount }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    const { randomUUID } = await import("node:crypto");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const cents = dollarAmount * 100;
    await sql`
      update wallets
      set balance_cents = balance_cents + ${cents}
      where user_id = ${context.userId}
    `;
    await sql`
      insert into payments (id, user_id, amount_cents, plan_id, created_at)
      values (${randomUUID()}, ${context.userId}, ${cents}, null, now())
    `;
    const [row] = await sql<{ balance_cents: number }>`
      select balance_cents from wallets where user_id = ${context.userId}
    `;
    return { balanceCents: row?.balance_cents ?? 0 };
  });

/** Returns the user's active plan id, or null if they have none. */
export const getUserPlan = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const [row] = await sql<{ plan_id: string | null }>`
      select plan_id from wallets where user_id = ${context.userId}
    `;
    return { planId: row?.plan_id ?? null };
  });

/**
 * Subscribe to a named plan: credits the plan amount AND records the plan id
 * on the wallet. Distinct from `addFunds` — a plain top-up must not flip the
 * plan, only an explicit plan checkout should.
 */
export const subscribePlan = createServerFn({ method: "POST" })
  .validator((input: { dollarAmount: number; planId: string }) => ({
    dollarAmount: Math.floor(Number(input.dollarAmount)),
    planId: String(input.planId),
  }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    const { randomUUID } = await import("node:crypto");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const cents = data.dollarAmount * 100;
    await sql`
      update wallets
      set balance_cents = balance_cents + ${cents}, plan_id = ${data.planId}
      where user_id = ${context.userId}
    `;
    await sql`
      insert into payments (id, user_id, amount_cents, plan_id, created_at)
      values (${randomUUID()}, ${context.userId}, ${cents}, ${data.planId}, now())
    `;
    const [row] = await sql<{ balance_cents: number; plan_id: string | null }>`
      select balance_cents, plan_id from wallets where user_id = ${context.userId}
    `;
    return { balanceCents: row?.balance_cents ?? 0, planId: row?.plan_id ?? null };
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

export const getUsageLogPage = createServerFn({ method: "GET" })
  .validator((input: {
    from?: string;
    to?: string;
    model?: string;
    key?: string;
    status?: "all" | "ok" | "failed";
    page?: number;
    pageSize?: number;
  }) => {
    const asIso = (value?: string) => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    };
    const pageSize = [10, 25, 50, 100].includes(Number(input.pageSize))
      ? Number(input.pageSize)
      : 10;
    return {
      from: asIso(input.from),
      to: asIso(input.to),
      model: input.model?.trim().slice(0, 100) || null,
      key: input.key?.trim().slice(0, 4) || null,
      status: input.status === "ok" || input.status === "failed" ? input.status : "all",
      page: Math.max(1, Math.floor(Number(input.page) || 1)),
      pageSize,
    };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { ensureAccount } = await import("./fyt-data.server.ts");
    const { getSql } = await import("@/lib/db");
    await ensureAccount(context.userId);
    const sql = await getSql();
    const filterRows = await sql<{
      total_rows: number;
      total_input: number;
      total_output: number;
      total_cost_cents: number;
      has_real_data: boolean;
    }>`
      select
        count(*)::int as total_rows,
        coalesce(sum(input_tokens), 0)::int as total_input,
        coalesce(sum(output_tokens), 0)::int as total_output,
        coalesce(sum(cost_cents), 0)::int as total_cost_cents,
        exists (
          select 1 from billing_rows all_rows
          where all_rows.user_id = ${context.userId}
        ) as has_real_data
      from billing_rows
      where user_id = ${context.userId}
        and ( ${data.from}::timestamptz is null or created_at >= ${data.from}::timestamptz)
        and ( ${data.to}::timestamptz is null or created_at <= ${data.to}::timestamptz)
        and ( ${data.model}::text is null or model ilike '%' || ${data.model} || '%')
        and ( ${data.key}::text is null or api_key_last4 = ${data.key})
        and (${data.status} = 'all' or (${data.status} = 'ok' and status = 'ok') or (${data.status} = 'failed' and status <> 'ok'))
    `;
    const [summary] = filterRows;
    const rows = await sql<{
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
        and (${data.from}::timestamptz is null or created_at >= ${data.from}::timestamptz)
        and (${data.to}::timestamptz is null or created_at <= ${data.to}::timestamptz)
        and (${data.model}::text is null or model ilike '%' || ${data.model} || '%')
        and (${data.key}::text is null or api_key_last4 = ${data.key})
        and (${data.status} = 'all' or (${data.status} = 'ok' and status = 'ok') or (${data.status} = 'failed' and status <> 'ok'))
      order by created_at desc
      limit ${data.pageSize}
      offset ${(data.page - 1) * data.pageSize}
    `;
    return {
      rows,
      totalRows: summary?.total_rows ?? 0,
      totalInput: summary?.total_input ?? 0,
      totalOutput: summary?.total_output ?? 0,
      totalCostCents: summary?.total_cost_cents ?? 0,
      hasRealData: summary?.has_real_data ?? false,
      page: data.page,
      pageSize: data.pageSize,
    };
  });
