// const Koa = require('koa');
import Koa from "koa";
import views from "koa-views";
import convert from "koa-convert";
import json from "koa-json";
import onerror from "koa-onerror";
import bodyparser from "koa-bodyparser";
import logger from "koa-logger";
import initGlobal from "./lib/global";
import middleware from "./lib/middleware";
import debugMaster from "debug";

const debug = debugMaster("template")

const app = new Koa();
const router = require('./api');

/**
 * BEGIN:middlewares
 */

app.use(convert(bodyparser())); // 格式化body
// app.use(convert(json())); // json转化
app.use(convert(logger())); // 日志打印
app.use(middleware.inject);
app.use(middleware.cors); // 设置跨域访问
app.use(middleware.returnObject);
app.use(middleware.exceptionHandler);
// routes  初始化路由，路由层由每次访问时动态注入业务实例
app.use(router.routes(), router.allowedMethods());
/**
 * END:middlewares
 */

// 异常处理
app.on('error', function(err, ctx) {
    debug('server error', err)
});


module.exports = app;
