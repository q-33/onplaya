-- BurnerMap — initial schema (plain Postgres + PostGIS, for DO Postgres).
-- Ported from the Supabase draft: no auth.users / auth.uid() / RLS — authorization
-- is enforced in the Nitro API layer against the session user. Idempotent.

-- Extensions (already enabled on the DB; harmless to re-assert) -----------------
create extension if not exists postgis;
create extension if not exists pgcrypto;   -- gen_random_uuid()

-- updated_at helper -------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- Users (auth + profile in one table; owned by nuxt-auth-utils) ------------------
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text not null,             -- scrypt/argon hash from nuxt-auth-utils; never plaintext
  display_name  text,
  playa_name    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists users_email_idx on users(lower(email));

-- Camps -------------------------------------------------------------------------
create table if not exists camps (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references users(id) on delete set null,  -- null = seeded/official
  name          text not null,
  year          int  not null,
  description   text,
  website       text,
  url           text,
  contact_email text,
  hometown      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists camps_owner_idx on camps(owner_id);
create index if not exists camps_year_idx  on camps(year);

-- Art installations -------------------------------------------------------------
create table if not exists art (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references users(id) on delete set null,
  name          text not null,
  year          int  not null,
  description   text,
  website       text,
  url           text,
  contact_email text,
  hometown      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists art_owner_idx on art(owner_id);
create index if not exists art_year_idx  on art(year);

-- Locations (belongs to exactly one camp OR one art) ----------------------------
-- gps_latitude/gps_longitude are the source of truth; geom is auto-derived for
-- PostGIS spatial queries (nearest-camp, within-radius, etc.).
create table if not exists locations (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid references users(id) on delete set null,
  camp_id        uuid references camps(id) on delete cascade,
  art_id         uuid references art(id)   on delete cascade,
  address_string text,             -- BRC clock+letter, e.g. "7:30 & E"
  hour           int,
  minute         int,
  road_letter    text,             -- Esplanade, A..L
  distance_ft    numeric,          -- art: feet from the Man
  gps_latitude   double precision,
  gps_longitude  double precision,
  geom geography(Point, 4326) generated always as (
    case
      when gps_longitude is not null and gps_latitude is not null
        then st_setsrid(st_makepoint(gps_longitude, gps_latitude), 4326)::geography
    end
  ) stored,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint locations_one_parent check (
    (camp_id is not null and art_id is null) or
    (camp_id is null and art_id is not null)
  )
);
create index if not exists locations_camp_idx  on locations(camp_id);
create index if not exists locations_art_idx   on locations(art_id);
create index if not exists locations_owner_idx on locations(owner_id);
create index if not exists locations_geom_idx  on locations using gist(geom);

-- updated_at triggers -----------------------------------------------------------
drop trigger if exists users_set_updated on users;
create trigger users_set_updated      before update on users      for each row execute function set_updated_at();
drop trigger if exists camps_set_updated on camps;
create trigger camps_set_updated      before update on camps      for each row execute function set_updated_at();
drop trigger if exists art_set_updated on art;
create trigger art_set_updated        before update on art        for each row execute function set_updated_at();
drop trigger if exists locations_set_updated on locations;
create trigger locations_set_updated  before update on locations  for each row execute function set_updated_at();
