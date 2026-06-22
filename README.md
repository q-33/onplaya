# 🔥 BurnerMap

[![CI](https://github.com/q-33/burnermap/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/q-33/burnermap/actions/workflows/ci.yml)

Find your people on the playa. An unofficial, community map of **Black Rock City** —
mark your camp's location before you arrive and update it once you have service on playa.

**Live: [burnermap.org](https://burnermap.org)**

> Unofficial map. Pins are approximate and do not equal reserved space. Only Burning Man
> Placement determines camp locations and only the ARTery determines art placement.

## What it does

### Map
- 🗺️ **Tile-free BRC map** — the city is drawn from a parametric geocoder + the official
  2026 plan geometry, so it renders the street grid (and works) without any map provider.
- 🎨 **Official-plan styling** — the default **Blocks** basemap mirrors the printed plan
  (blue camp blocks, dark street grid, radial gradient fans, plazas, the Center Camp
  keyhole, trash-fence pentagon). Toggle to a **Streets** vector basemap.
- 🧭 **Where am I** — live GPS on the city grid with a reverse-geocoded readout
  (e.g. _"near 7:30 & Eternal"_), a compass rose, and a live **weather** widget.
- 🪧 **Civic landmarks** — medical, Rangers/safety, services (Ice, DPW, Playa Info…),
  transport (airport, Greeters, fuel) and the Temple, plus approximate porta-potty banks.
- 👁️ **Layer toggles** — declutter the map by category (camps, art, services, …).

### Community
- 📍 **Drop your camp** — log in, tap the map to place a pin at the **exact spot** (no
  snapping), name it, done. One camp per user — move or rename it anytime. GPS optional.
- 🎭 **Art & open calls** — register artworks, mark their location, and post an open
  **call** for community contributions (owner-moderated).
- 📅 **Events** — camps announce planned events; browse them grouped by day.
- 🚧 **Gate Road conditions** — the GPE crew posts live inbound/exodus status; a
  green/yellow/red widget on the map links to the full board.
- 💬 **In-app messaging** — 1:1 direct messages between users ("Message the organizer"
  on any camp/art), an inbox with unread badges, and a **Message the Admin** chat. An
  optional email nudge fires on the first unread (via Resend, when configured).
- 🔎 **Browse & search** camps and art (Postgres-native, no external index).

### Accounts & moderation
- 🔑 **Auth** — email/password sessions (`nuxt-auth-utils`).
- 🛡️ **Roles** — `user` / `gpe` (Gate Road) / `admin`, applied live without re-login.
- 🧰 **Admin panel** — moderation queue, content reports, people & roles, content
  management, and an audit log.
- 🚩 **Feature flags** — per-user early access to upcoming features.
- 🏙️ **Current-year aware** — 2026 themed street names (_Axis Mundi_: Ararat → Kundalini).

## Stack

| | |
|---|---|
| Frontend | [Nuxt 4](https://nuxt.com) + [Nuxt UI](https://ui.nuxt.com) (Reka + Tailwind) |
| Map | [MapLibre GL](https://maplibre.org) |
| API / auth | Nitro server routes + [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) |
| Data | [Drizzle ORM](https://orm.drizzle.team) → DigitalOcean **Postgres + PostGIS** |
| Geocoder | `lib/brc` — parametric BRC address ⇄ lat/lng (pure TS, tested) |
| Email | [Resend](https://resend.com) (optional — message nudges) |
| Hosting | DigitalOcean App Platform (Node service) |

## Develop

```bash
pnpm install

# .env (gitignored) needs:
#   DATABASE_URL=postgresql://…           # Postgres with PostGIS
#   NUXT_SESSION_PASSWORD=…               # 32+ char session secret (auto-added in dev)
#   RESEND_API_KEY=…                      # optional — enables message-notification email
#   EMAIL_FROM="BurnerMap <noreply@burnermap.org>"   # optional sender

pnpm db:migrate   # apply db/migrations/*.sql (idempotent)
pnpm dev          # http://localhost:3000
```

Migrations are plain idempotent SQL in `db/migrations/` and are **not** auto-run on
deploy — apply them with `pnpm db:migrate` (reads `DATABASE_URL`).

## Verify

```bash
pnpm test         # vitest — geocoder + city-grid
pnpm typecheck    # nuxt typecheck
pnpm build        # production (Nitro Node) build
```

CI runs all three on every push to `main` (see the badge above).

## The BRC geocoder

`lib/brc/geocode.ts` models Black Rock City as a polar city (the Man at center, a
30°/hour clock bearing, concentric lettered streets) and converts addresses to
coordinates with no shipped per-year geometry. To roll to a new year, update
`STREET_NAMES` + `CITY_YEAR` (and only refit the radii if the city plan's geometry
actually changes).
