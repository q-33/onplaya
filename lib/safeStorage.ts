// Guarded localStorage access. In some environments the `window.localStorage`
// getter itself THROWS on access (not just returns null): private mode, blocked
// third-party/partitioned storage, and — the reason this exists — in-app
// webviews like the Facebook browser, which raise "Access is denied for this
// document." An unguarded read there crashes hydration into a 500 page. Storage
// is best-effort, so we swallow failures and degrade gracefully.
export function safeGetItem(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null
  }
  catch {
    return null
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value)
  }
  catch {
    // no-op: storage unavailable/blocked
  }
}
