import { desc, eq } from 'drizzle-orm'
import { camps } from '../../db/schema'

// The current user's own camps (for the "pick existing vs create" picker).
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const db = useDb()
  return db.query.camps.findMany({
    where: eq(camps.ownerId, user.id),
    orderBy: [desc(camps.createdAt)],
    with: {
      locations: { columns: { addressString: true, createdAt: true } },
    },
  })
})
