
/**
 * @middleware handle exception
 * 异常处理中间件，主要处理400客户端错误和500服务器错误
 */
module.exports = async function(ctx, next) {
	try {
		await next();
	} catch (e) {
		// 服务器引起的异常或未知异常
		if (e.name == "SequelizeValidationError") {
			ctx.status = 400;
			ctx.body = {
				errno: 3202,
				errmsg: e.message
			};
		} else if (e instanceof GeneralityError) {
			ctx.status = 400;
			ctx.body = {
				errno:  e.errno,
				errmsg: e.message
			};
		} else if (e instanceof AbstractError) {
			ctx.status = e.errno < 1000 ? e.errno : 500
			ctx.body = {
				errno: e.errno || 500,
				errmsg: e.message
			}
		} else {
			ctx.status = 500;
			ctx.body = {
				errno: e.errno || 500,
				errmsg: e.message
			};
			console.log("Application Error:", e);
		}
	}
}
