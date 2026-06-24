import { createHash } from 'node:crypto'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { passwordResetTokens, users } from '../../db/schema'
import { resetPasswordSchema } from '../../utils/validation'

// Complete a password reset with a valid, unused, unexpired token.
export default defineEventHandler(async (event) => {
  rateLimit(event, 'reset-ip', 10, 15 * 60_000)
  const { token, password } = await readValidatedBody(event, resetPasswordSchema.parse)
  const db = useDb()

  const tokenHash = createHash('sha256').update(token).digest('hex')
  const [row] = await db
    .select({ id: passwordResetTokens.id, userId: passwordResetTokens.userId })
    .from(passwordResetTokens)
    .where(and(
      eq(passwordResetTokens.tokenHash, tokenHash),
      isNull(passwordResetTokens.usedAt),
      gt(passwordResetTokens.expiresAt, new Date()),
    ))
    .limit(1)
  if (!row)
    throw createError({ statusCode: 400, statusMessage: 'This reset link is invalid or has expired. Request a new one.' })

  const passwordHash = await hashPassword(password)
  await db.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, row.userId))
    // mark this token used + invalidate any other outstanding tokens for the user
    await tx.update(passwordResetTokens).set({ usedAt: new Date() })
      .where(and(eq(passwordResetTokens.userId, row.userId), isNull(passwordResetTokens.usedAt)))
  })

  await audit(row.userId, 'password.reset', { targetType: 'user', targetId: row.userId })
  return { ok: true }
})
