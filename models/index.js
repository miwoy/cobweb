import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import uuid from "node-uuid";
import debugFactory from "debug";
// import { encrypt } from "../lib/common";
import cls from "continuation-local-storage";

const debug = debugFactory("cobweb:models");

// 构建sequelize命名空间
const namespace = cls.createNamespace("cobweb-namespace");

let opts = conf.mysql;

/**
 * 全局配置define参数
 * @type {Object}
 */
opts.define = {
	timestamps: true,
	paranoid: true,
	freezeTableName: true,
	id: {
		type: Sequelize.STRING(36),
		primaryKey: true,
		unique: true
	},
	hooks: {
		beforeCreate: function(data) {
			if (data)
				data.id = data.id || uuid.v4();
		}
	}
};

Sequelize.cls = namespace; // 启用CLS
let sequelize = new Sequelize(conf.mysql.database, conf.mysql.username, conf.mysql.password, opts);

const basename = path.basename(module.filename);

let dbs = {
	Sequelize: Sequelize,
	sequelize: sequelize
};

let models = [];


fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== basename);
	})
	.forEach(function(file) {

		let model = sequelize.import(path.join(__dirname, file));
		// 包裹model
		models.push(model);
		dbs[model.name] = model;
		debug(model.name);
	});

models.forEach(model => {
	model.associate && model.associate(dbs);
	// model.associate(dbs);
});
sequelize.sync({
	force: false
}).then(function() {
	debug("sequelize sync success.");
}).catch(function(err) {
	debug("sequelize sync error:", err);
});


export default dbs;
