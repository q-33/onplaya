import { desc, ilike, or } from 'drizzle-orm'
import { art } from '../../db/schema'

// Public: list art installations with their locations. Optional ?q= filters by
// name / description / hometown (case-insensitive substring).
export default defineEventHandler(async (event) => {
  const q = getQuery(event).q
  const term = typeof q === 'string' ? q.trim() : ''
  const db = useDb()

  const where = term
    ? or(
        ilike(art.name, `%${term}%`),
        ilike(art.description, `%${term}%`),
        ilike(art.hometown, `%${term}%`),
      )
    : undefined

  return db.query.art.findMany({
    where,
    orderBy: [desc(art.createdAt)],
    limit: 200,
    with: {
      locations: {
        columns: { addressString: true, gpsLatitude: true, gpsLongitude: true, createdAt: true },
      },
    },
  })
})
