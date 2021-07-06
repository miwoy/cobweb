const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const inflection = require('inflection'); // 复数转化
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
	router.use("/" + file.split(".js")[0], _router.routes());
	return file
});

module.exports = router;