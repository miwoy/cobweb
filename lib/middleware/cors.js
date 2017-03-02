export default async function cors(ctx, next) {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Set-Cookie,Accept,Pragma,Cache-Control,Authorization");
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    ctx.set("X-Powered-By", ' 3.2.1');
    ctx.set("Content-Type", "application/json;charset=utf-8");
    // res.header("Last-Modified", new Date().getTime());

    ctx.set("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    ctx.set("Pragma", "no-cache"); // HTTP 1.0.
    ctx.set("Expires", "0"); // Proxies.

    await next();
}