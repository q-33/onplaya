// Browser shim for the tiny slice of `os` that @meshtastic/core's logger (tslog)
// imports. Client build only; the Nitro server uses the real module.
export const hostname = () => ''
export const EOL = '\n'
export const platform = () => 'browser'
export default { hostname, EOL, platform }
