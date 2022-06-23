const config = {
    port: typeof process != "undefined" ? (process?.env?.PORT || 8100) : 8100,
    authPort: typeof process != "undefined" ? (process?.env?.PORT || 8090) : 8090,
    httpPort: 8080,
    hostname: typeof window != "undefined" ? window.location.hostname : "159.223.199.71"
}
export default config
