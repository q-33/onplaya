import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema'

// Lazily create one pooled postgres client + Drizzle instance per server process.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDb() {
  if (!_db) {
    const url = useRuntimeConfig().databaseUrl
    if (!url)
      throw createError({ statusCode: 500, statusMessage: 'DATABASE_URL is not configured' })
    const client = postgres(url, { prepare: false })
    _db = drizzle(client, { schema })
  }
  return _db
}

export { schema }
