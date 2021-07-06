const jwt = require("../common/jwt")
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
    


    await next();
}