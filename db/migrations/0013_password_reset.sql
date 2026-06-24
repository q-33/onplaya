-- BurnerMap — password-reset tokens. Idempotent.
-- A reset request stores only the SHA-256 hash of a single-use token; the raw
-- token is emailed to the user. Tokens expire (1 hour) and are marked used.
create table if not exists password_reset_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  token_hash  text not null,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists password_reset_tokens_hash_idx on password_reset_tokens(token_hash);
create index if not exists password_reset_tokens_user_idx on password_reset_tokens(user_id);
