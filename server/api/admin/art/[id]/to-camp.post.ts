import { eq } from 'drizzle-orm'
import { art, camps, locations } from '../../../../db/schema'

// Admin: convert an artwork into a camp (for users who dropped their camp as
// art). Creates a camp from the art's fields, moves its location pin(s) over,
// and deletes the now-redundant artwork.
export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDb()
  const row = await db.query.art.findFirst({
    where: eq(art.id, id),
    columns: { id: true, ownerId: true, name: true, year: true, description: true, website: true, contactEmail: true, hometown: true },
  })
  if (!row)
    throw createError({ statusCode: 404, statusMessage: 'Art not found' })

  // One camp per owner — don't clobber an existing camp.
  if (row.ownerId) {
    const [existing] = await db.select({ id: camps.id }).from(camps).where(eq(camps.ownerId, row.ownerId)).limit(1)
    if (existing)
      throw createError({ statusCode: 409, statusMessage: 'That artist already owns a camp — can\'t convert without overwriting it.' })
  }

  const camp = await db.transaction(async (tx) => {
    const [created] = await tx.insert(camps).values({
      ownerId: row.ownerId,
      name: row.name,
      year: row.year,
      description: row.description,
      website: row.website,
      contactEmail: row.contactEmail,
      hometown: row.hometown,
    }).returning({ id: camps.id })
    // Re-point the art's location pin(s) to the new camp, then delete the art
    // (its contributions/claims cascade; locations were already moved).
    await tx.update(locations).set({ campId: created!.id, artId: null }).where(eq(locations.artId, id))
    await tx.delete(art).where(eq(art.id, id))
    return created!
  })

  await audit(admin.id, 'art.to_camp', { targetType: 'art', targetId: id, detail: camp.id })
  return { ok: true, campId: camp.id }
})
