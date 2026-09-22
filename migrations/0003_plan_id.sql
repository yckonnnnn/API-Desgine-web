-- Tracks the user's active plan (pro / max / business). NULL when the user
-- has no plan — they are either Free (no balance) or Plus (has balance but
-- no plan subscription).
alter table wallets add column if not exists plan_id text;
