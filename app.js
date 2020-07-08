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
const convert = require("koa-convert");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger4miwoy");
const middleware = require("./lib/middleware");
const Debug = require("debug");
const debug = Debug("cobweb");
const app = new Koa();
const router = require("./routes");

/**
 * BEGIN:middlewares
 */
app.use(convert(bodyparser())); // 格式化body
app.use(convert(logger())); // 日志打印

app.use(middleware.cors); // 设置跨域访问
app.use(middleware.returnObject);
app.use(middleware.exceptionHandler);
app.use(pub(path.join(__dirname, "./src")));
app.use(views(path.join(__dirname, "./views"), {
	extension: "ejs"
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
