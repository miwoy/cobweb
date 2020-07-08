const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const inflection = require('inflection'); // 复数转化
const models = require("../../models")
const {
	buildRestful
} = require("../../lib/common")
let files = []
let routes = null
const basename = path.basename(module.filename);
let router = new Router({
	prefix: "/api"
});


files = fs
	.readdirSync(__dirname)
	.filter(function (file) {
		return (file.indexOf(".") !== 0) && (file !== basename);
	})
files.map(function (file) {
	var _router = require(path.join(__dirname, file));
	file = file.split(".js")[0]
	let model = models[file]
	if (model) buildRestful(_router, model)
	router.use("/" + (model ? inflection.pluralize(file.split(".js")[0]) : file.split(".js")[0]), _router.routes());
	return file
});

router.get("/", async (ctx) => {
	if (!routes) {
		
		routes = files.reduce((t, i) => {
			let key = i.indexOf(".js")>=0?inflection.pluralize(i.split(".js")[0]):i
			t[key] = `${ctx.request.origin}${path.resolve(ctx.path, key)}`
			return t
		}, {})
	}

	ctx.sbody = routes
})

module.exports = router;