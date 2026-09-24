-- Payment records for top-ups and plan purchases
create table if not exists payments (
  id text primary key,
  user_id text not null,
  amount_cents integer not null,
  plan_id text,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);
create index if not exists payments_user_id_idx on payments (user_id);
create index if not exists payments_created_at_idx on payments (created_at);
