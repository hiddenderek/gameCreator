const config = {
    port: typeof process != "undefined" ? (process?.env?.PORT || 8080) : 8080,
    authPort: typeof process != "undefined" ? (process?.env?.PORT || 8090) : 8090,
    hostname: "192.168.1.4"
}
export default config