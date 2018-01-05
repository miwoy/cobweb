import fs from "fs";
import path from "path";

const basename = path.basename(module.filename);
let common;

if (!common) {
	common = {};
	fs
		.readdirSync(__dirname)
		.filter(function(file) {
			return (file.indexOf(".") !== 0) && (file !== basename);
		})
		.forEach(function(file) {
			common[file.split(".js")[0]] = require(path.join(__dirname, file));
		});
}

export default common;
