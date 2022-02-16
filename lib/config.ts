let port = {
    port: typeof process != "undefined" ? (process?.env?.PORT || 8080) : 8080,
    authPort: typeof process != "undefined" ? (process?.env?.PORT || 8090) : 8090
}
export default port