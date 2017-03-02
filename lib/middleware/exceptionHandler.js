import common from "../common";


export default async function(ctx, next) {
    try {
        await next();
    } catch (e) {
        if ((e instanceof Error) && !e.errno) {
            ctx.status = 500;
            console.log("Application Error:", e);
        } else {

            if (e instanceof ArgsGeneralityError) {
                ctx.body = {
                    errno: e.errno,
                    errmsg: e.message
                }
            }

            ctx.status = 200;
            let body = {
                errno: e.errno,
                errmsg: e.message
            }
            ctx.body = body;
        }
    }
}
