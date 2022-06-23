const config = {
    port: typeof process != "undefined" ? (process?.env?.PORT || 8100) : 8100,
    authPort: typeof process != "undefined" ? (process?.env?.PORT || 8090) : 8090,
    httpPort: 8080,
    hostname: "dchapman-portfolio.site"
}
export default config
