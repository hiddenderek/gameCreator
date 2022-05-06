const config = {
    port: typeof process != "undefined" ? (process?.env?.PORT || 8100) : 8100,
    authPort: typeof process != "undefined" ? (process?.env?.PORT || 8090) : 8090,
    httpPort: 8080,
    hostname: "192.168.1.4"
}
export default config