import Router from "koa-router";
import fs from "fs";
import path from "path";
import marked from "marked";



/**
 * 如果不设置prefix: "/"，则为默认路由配置
 * 所有未找到的地址都将匹配到index处理器上
 * @type {[type]}
 */
const basename = path.basename(module.filename);
let router = new Router({
	prefix: "/"
});

/**
 * 路由示例
 * 127.0.0.1:3000
 */
router.get("/", async(ctx) => {

	marked.setOptions({
		renderer: new marked.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: false
	});
	let md = fs.readFileSync("./README.md", {encoding: "utf8"});
	ctx.set("Content-Type", "text/html;charset=utf-8");
	ctx.body = marked(md);
});

fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== basename);
	})
	.forEach(function(file) {
		var _router = require(path.join(__dirname, file));
		router.use("/" + file.split(".js")[0], _router.routes(), _router.allowedMethods());
	});

export default router;
