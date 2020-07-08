const jwt = require("../common/jwt")
const dbs = require("../../models")
module.exports = async (ctx, next)=> {
    if (!ctx.headers.authorization) {
        throw new AuthError("缺少认证参数 Authorization")
    }

    // if (!ctx.headers["x-site-id"]) {
    //     throw new AuthError("缺少必要参数 x-site-id")
    // }

    let authObj = ctx.headers.authorization.split(" ")

    if (authObj[0].toLowerCase() != "bearer") {
        throw new AuthError("Token 类型不正确")
    }

    let user
    try {
        let payload = jwt.verify(authObj[1])
        user = payload.data
    } catch (e) {
        throw new AuthError(e.message)
    }
    

    /**
     * TODO 校验用户版本，用来处理手动过期
     */
    let paths = ctx.path.split("/")
    if (ctx.headers["x-site-id"]) {
        path = paths.concat(["sites", ctx.headers["x-site-id"]])
    }
    let verifyResult = await dbs.user.permissionVerify(user.id, ctx.routerName, paths)
    if (user.code != "miwoes" &&  !verifyResult) {
        throw new VerifyError("无操作接口权限")
    }
    ctx.user = user
    await next();
}