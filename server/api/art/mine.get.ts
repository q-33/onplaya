import { desc, eq } from 'drizzle-orm'
import { art } from '../../db/schema'

// The current user's own art (for the "pick existing vs create" picker).
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const db = useDb()
  return db.query.art.findMany({
    where: eq(art.ownerId, user.id),
    orderBy: [desc(art.createdAt)],
    with: { locations: { columns: { addressString: true, createdAt: true } } },
  })
})
