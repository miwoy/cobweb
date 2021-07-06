module.exports = async function cors(ctx, next) {
	const origins = conf.cors.allowoOrigins
	if(origins.includes(ctx.request.headers.origin) || origins==="*"){
		ctx.set("Access-Control-Allow-Origin", ctx.request.headers.origin);
	} else {
		ctx.set("Access-Control-Allow-Origin", "http://localhost:8000")
	}
	
	ctx.set("Access-Control-Allow-Headers", conf.cors.allowHeaders.join(","));
	ctx.set("Access-Control-Allow-Credentials", "true")
	ctx.set("Access-Control-Allow-Methods", conf.cors.allowMethods.join(","));
	ctx.set("X-Powered-By", " 3.2.1");

	// ctx.set("Content-Type", "application/json;charset=utf-8");
	// res.header("Last-Modified", new Date().getTime());

	ctx.set("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
	ctx.set("Pragma", "no-cache"); // HTTP 1.0.
	ctx.set("Expires", "0"); // Proxies.
	if (ctx.request.method==="OPTIONS") {
		return ctx.status = 204
	}
	await next();
}
