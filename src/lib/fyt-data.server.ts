import { randomBytes, randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";

const MODELS = ["GPT-5", "Claude 4", "Gemini 2.5", "DeepSeek V3", "Grok 3", "Qwen 3", "Kimi K2"];

export async function ensureAccount(userId: string) {
  const sql = await getSql();
  const existing = await sql<{ user_id: string }>`
    select user_id from wallets where user_id = ${userId}
  `;
  if (existing.length) return;

  await sql`
    insert into wallets (user_id, balance_cents, requests, success_bps)
    values (${userId}, 124850, 18429, 9998)
  `;
  await sql`
    insert into api_keys (id, user_id, name, last4, disabled)
    values (${randomUUID()}, ${userId}, 'Production', '8x2K', false)
  `;

  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const day = d.toISOString().slice(0, 10);
    const wave = Math.sin(i / 2.2) * 0.18;
    const input = Math.round(601000 * (1 + wave + (i % 3) * 0.03));
    const output = Math.round(316000 * (1 + wave * 0.8));
    const cost = Math.round((input * 1.1 + output * 4.2) / 1000);
    await sql`
      insert into usage_days (user_id, day, input_tokens, output_tokens, cost_cents)
      values (${userId}, ${day}::date, ${input}, ${output}, ${cost})
      on conflict (user_id, day) do nothing
    `;
  }

  for (let i = 0; i < 12; i++) {
    const created = new Date(today.getTime() - i * 3600_000 * 5);
    const model = MODELS[i % MODELS.length];
    const input = 12000 + i * 1730;
    const output = 4200 + i * 640;
    const cost = Math.round((input + output * 4) / 900);
    await sql`
      insert into billing_rows
        (user_id, created_at, model, api_key_last4, input_tokens, output_tokens, cost_cents, status)
      values (
        ${userId},
        ${created.toISOString()}::timestamptz,
        ${model},
        '8x2K',
        ${input},
        ${output},
        ${cost},
        'ok'
      )
    `;
  }
}

export async function ensureAnalyticsData() {
  const sql = await getSql();
  await sql`
    create table if not exists payments (
      id text primary key,
      user_id text not null,
      amount_cents integer not null,
      plan_id text,
      status text not null default 'completed',
      created_at timestamptz not null default now()
    )
  `;

  const [existing] = await sql<{ count: number }>`
    select count(*)::int as count from payments
  `;
  if (existing && existing.count > 0) return;

  const now = new Date();
  // Realistic seed data across past 6 days + today
  const seeds = [
    { daysAgo: 6, payments: [{ user: "user_alpha", amount: 10000, plan: "pro" }] },
    { daysAgo: 5, payments: [{ user: "user_beta", amount: 20000, plan: "max" }, { user: "user_gamma", amount: 5000, plan: null }] },
    { daysAgo: 4, payments: [{ user: "user_delta", amount: 10000, plan: "pro" }] },
    { daysAgo: 3, payments: [{ user: "user_epsilon", amount: 50000, plan: "business" }, { user: "user_zeta", amount: 20000, plan: "max" }, { user: "user_eta", amount: 10000, plan: null }] },
    { daysAgo: 2, payments: [{ user: "user_theta", amount: 20000, plan: "max" }, { user: "user_iota", amount: 10000, plan: "pro" }] },
    { daysAgo: 1, payments: [{ user: "user_kappa", amount: 20000, plan: "max" }, { user: "user_lambda", amount: 10000, plan: "pro" }] },
    { daysAgo: 0, payments: [{ user: "user_mu", amount: 10000, plan: "pro" }, { user: "demo-admin", amount: 20000, plan: "max" }] },
  ];

  for (const s of seeds) {
    const d = new Date(now.getTime() - s.daysAgo * 86400_000);
    // Add sample payments
    for (const p of s.payments) {
      await sql`
        insert into payments (id, user_id, amount_cents, plan_id, created_at)
        values (${randomUUID()}, ${p.user}, ${p.amount}, ${p.plan}, ${d.toISOString()}::timestamptz)
      `;
    }

    // Also ensure historical user signups exist for the curves
    if (s.daysAgo > 0) {
      for (let u = 0; u < (s.daysAgo % 3) + 2; u++) {
        const uid = `sample_user_${s.daysAgo}_${u}`;
        await sql`
          insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
          values (${uid}, ${`User ${s.daysAgo}-${u}`}, ${`u${s.daysAgo}_${u}@example.com`}, true, ${d.toISOString()}::timestamptz, ${d.toISOString()}::timestamptz)
          on conflict (id) do nothing
        `;
      }
    }
  }
}

export async function newApiSecret() {
  const secret = `sk-fyt-${randomBytes(18).toString("base64url")}`;
  return { secret, last4: secret.slice(-4), id: randomUUID() };
}
