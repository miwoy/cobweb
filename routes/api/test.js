import Router from "koa-router";
import { test } from "../../application";

let router = new Router();



router.get("/getTests", async function(ctx) {
	var r = await test.getList();
	ctx.sbody = r;
});

export default router;
