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

export async function newApiSecret() {
  const secret = `sk-fyt-${randomBytes(18).toString("base64url")}`;
  return { secret, last4: secret.slice(-4), id: randomUUID() };
}
