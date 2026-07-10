// Browser shim for the slice of `util` tslog imports (log formatting + type checks).
export function inspect(obj) {
  try { return typeof obj === 'string' ? obj : JSON.stringify(obj) }
  catch { return String(obj) }
}
export function formatWithOptions(_opts, ...args) {
  return args.map(a => (typeof a === 'string' ? a : inspect(a))).join(' ')
}
export function format(...args) {
  return formatWithOptions({}, ...args)
}
export const types = new Proxy(
  { isNativeError: (e) => e instanceof Error, isDate: (d) => d instanceof Date },
  { get: (t, p) => (p in t ? t[p] : () => false) },
)
export default { inspect, format, formatWithOptions, types }
