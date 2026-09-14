create table if not exists wallets (
  user_id text primary key,
  balance_cents integer not null default 0,
  requests integer not null default 0,
  success_bps integer not null default 9998,
  created_at timestamptz not null default now()
);

create table if not exists api_keys (
  id text primary key,
  user_id text not null,
  name text not null,
  last4 text not null,
  disabled boolean not null default false,
  created_at timestamptz not null default now(),
  last_used timestamptz
);
create index if not exists api_keys_user_id_idx on api_keys (user_id);

create table if not exists usage_days (
  id serial primary key,
  user_id text not null,
  day date not null,
  input_tokens integer not null,
  output_tokens integer not null,
  cost_cents integer not null,
  unique (user_id, day)
);
create index if not exists usage_days_user_id_idx on usage_days (user_id);

create table if not exists billing_rows (
  id serial primary key,
  user_id text not null,
  created_at timestamptz not null default now(),
  model text not null,
  api_key_last4 text not null,
  input_tokens integer not null,
  output_tokens integer not null,
  cost_cents integer not null,
  status text not null
);
create index if not exists billing_rows_user_id_idx on billing_rows (user_id);
