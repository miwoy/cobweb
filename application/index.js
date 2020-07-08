const fs = require("fs");
const path = require("path");
const common = require("../lib/common");
const db = require("../models");

const basename = path.basename(module.filename);
let application;


if (!application) {
	application = {};

	fs
		.readdirSync(__dirname)
		.filter(function (file) {
			return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
		})
		.forEach(function (file) {
			let _export = require(path.join(__dirname, file));
			let prop = file.split(".js")[0];
			application[prop] = _export(db, common);
			// Object.defineProperty(application, prop, {
			//     get: function() {
			//         return new _Class({
			//             db: db,
			//             common: common
			//         });
			//     }
			// });
		});
}

module.exports = application;