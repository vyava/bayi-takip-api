export * from "./bayi.controller"
export * from "./bolge.controller"
export * from "./dist.controller"
export * from "./user.controller"
export * from "./tapdk.controller"
export * from "./mail.controller"

module.exports = {
    TAPDK : require("./tapdk.controller"),
    MAIL  : require("./mail.controller")
}