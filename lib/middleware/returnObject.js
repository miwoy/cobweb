export default async function(ctx, next) {
    ctx.rbody = ctx.request.body;
    await next();
    if (ctx.status === 200 && !ctx.body.errno) {
        var data = ctx.body;
        ctx.body = {
            errno: 0,
            errmsg: "ok",
            data: data
        }
    }
}
