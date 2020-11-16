/**
 * 服务模板
 * <br/>prefix: /api/template
 * @module 服务模板
 */
require("./lib/global");
const path = require("path");
const Koa = require("koa");
const pub = require("koa-static");
const views = require("koa-views");
const bodyparser = require("koa-body");
const logger = require("koa-logger4miwoy");
const middleware = require("./lib/middleware");
const Debug = require("debug");
const debug = Debug("version.bfh.zdbx.net");
const app = new Koa();
const router = require("./routes");

/**
 * BEGIN:middlewares
 */
app.use(bodyparser({
	formidable:{
		uploadDir: conf.uploadDir,
		hash: "md5",
		keepExtensions: true
	},    //This is where the files would come
	multipart: true,
	urlencoded: true
 })); // 格式化body
app.use(logger()); // 日志打印

app.use(middleware.cors); // 设置跨域访问
app.use(middleware.returnObject);
app.use(middleware.exceptionHandler);
app.use(pub(path.join(__dirname, "./src")));
app.use(views(path.join(__dirname, "./views"), {
	extension: "jade"
}));

// routes  初始化路由，路由层由每次访问时动态注入业务实例
app.use(router.routes(), router.allowedMethods());
/**
 * END:middlewares
 */

// 异常处理
app.on("error", function(err) {
	debug("server error", err);
});
console.log(process.env.NODE_PATH)

module.exports = app;
