export default async function(ctx, next) {
	ctx.rbody = ctx.request.body; // rbody 代表request body
	Object.defineProperty(ctx, "sbody", { // sbody 代表 response body
		set: (value) => {
			ctx.body = {
				errno: 0,
				errmsg: "ok",
				data: value
			};
		},
		get: () => {
			return ctx.body instanceof Buffer ? null : ctx.body;
		}
	});
	await next();
}
