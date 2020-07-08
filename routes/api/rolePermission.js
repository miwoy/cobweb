const Router = require("koa-router")
const { rolePermission } = require("../../application")
const { authenticate } = require("../../lib/middleware")
const qs = require("qs")

let router = new Router()

module.exports = router
