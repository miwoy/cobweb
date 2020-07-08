const Router = require("koa-router")
const { test } = require("../../application")
const { authenticate } = require("../../lib/middleware")
const qs = require("qs")

let router = new Router()

router.get("test.otherApi", "/otherApi", authenticate, async(ctx)=> {
    ctx.sbody = await test.otherApi()
})

router.post("test.move", "/:id/move", async(ctx)=> {
    ctx.sbody = await test.move(ctx.params.id, ctx.rbody.preId, ctx.rbody.altId)
})

module.exports = router
