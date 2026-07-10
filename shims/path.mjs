// Browser shim for the slice of `path` tslog imports (stack-trace file paths).
export const sep = '/'
export const normalize = (p) => String(p)
export const basename = (p) => String(p).split('/').pop() ?? ''
export const dirname = (p) => String(p).split('/').slice(0, -1).join('/')
export default { sep, normalize, basename, dirname }
