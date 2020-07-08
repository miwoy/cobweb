const Router = require("koa-router")
const { user } = require("../../application")
const { authenticate } = require("../../lib/middleware")
const {  jwt } = require("../../lib/common")

let router = new Router()


router.post("user.regist", "/regist", async (ctx)=> {
    ctx.sbody = await user.regist(ctx.rbody)
})

router.post("user.login", "/login", async (ctx)=> {
    let r = await user.login(ctx.rbody)
    let token = jwt.sign({
        id: r.id,
        name: r.name,
        code: r.code,
        updatedAt: r.updatedAt
    })
    ctx.sbody = token
})

/**
 * 校验邮箱验证码
 */
router.post("user.verifyEmailCode", "/verifyEmailCode", async (ctx)=> {
    let r = await user.verifyEmailCode(ctx.rbody)
    let token = jwt.sign({
        id: r.id,
        name: r.name,
        code: r.code,
        updatedAt: r.updatedAt
    })
    ctx.sbody = token
})

/**
 * 校验手机验证码
 */
router.post("user.verifyMobileCode", "/verifyMobileCode", async (ctx)=> {
    let r = await user.verifyMobileCode(ctx.rbody)
    let token = jwt.sign({
        id: r.id,
        name: r.name,
        code: r.code,
        updatedAt: r.updatedAt
    })
    ctx.sbody = token
})

/**
 * 修改密码
 * 1.登录
 * 2.传递旧密码与新密码
 */
router.post("user.updatePwd", "/updatePwd", authenticate, async (ctx)=> {
    ctx.sbody = await user.updatePwd(ctx.user.id, ctx.rbody.oldPassword, ctx.rbody.newPassword)
})

/**
 * 重置密码
 * 1.发送验证码
 * 2.验证
 * 3.返回 token
 * 4.重置密码
 */
 router.post("user.resetPwd", "/resetPwd", authenticate, async (ctx)=> {
     ctx.sbody = await user.resetPwd(ctx.user.id, ctx.rbody.password)
 })

module.exports = router
