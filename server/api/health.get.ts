import { sql } from 'drizzle-orm'

// Liveness + DB connectivity probe. Confirms Nitro can reach Postgres + PostGIS.
export default defineEventHandler(async () => {
  const db = useDb()
  const [row] = await db.execute<{ postgis: string, camps: number }>(sql`
    select postgis_version() as postgis,
           (select count(*)::int from camps) as camps
  `)
  return { ok: true, postgis: row?.postgis, camps: row?.camps }
})
