const qs = require("qs")

module.exports = async function(ctx, next) {
	ctx.q = qs.parse(ctx.querystring) // 使用 qs 解析的 query
	ctx.rbody = ctx.request.body; // rbody 代表request body
	Object.defineProperty(ctx, "sbody", { // sbody 代表 response body
		set: (value) => {
			if (value === undefined) {
				ctx.body = undefined
			} else {
				ctx.body = {
					errno: 0,
					errmsg: "ok",
					data: value
				};
			}
		},
		get: () => {
			return ctx.body instanceof Buffer ? null : ctx.body;
		}
	});
	await next();
}
