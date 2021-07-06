const Router = require("koa-router")
const qs = require("qs")
const mq = require("lib/service/mq")

let router = new Router()

router.get("/openmq", async(ctx)=> {
	mq.start()
	ctx.body = "ok"
})

module.exports = router
