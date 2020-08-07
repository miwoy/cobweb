const fs = require("fs");
const path = require("path");
const {
	Sequelize,
	Op,
	DataTypes
} = require("sequelize");
const uuid = require("uuid");
const debugFactory = require("debug");
const cls = require("cls-hooked");
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
	freezeTableName: false,
	defaultScope: {
		attributes: {
			exclude: ["deletedAt"] // 默认排除
		}
	},
	hooks: {
		beforeCreate: function (data) {
			data.setDataValue("_id", data.getDataValue("id"))
		}
	}
};

// 设置别名
const aliases = ["eq", "ne", "is", "not", "or", "col", "gt", "gte", "lt", "lte",
	"between", "notBetween", "all", "in", "notIn", "like", "notLike", "startsWith",
	"substring", "iLike", "notILike", "regexp", "notRegexp", "iRegexp", "notIRegexp",
	"any"
]
opts.operatorsAliases = aliases.reduce((t, i) => {
	t[`$${i}`] = Op[i]
	return t
}, {})

Sequelize.useCLS(namespace); // 启用CLS
let sequelize = new Sequelize(conf.mysql.database, conf.mysql.username, conf.mysql.password, opts);

const basename = path.basename(module.filename);

let dbs = {
	Sequelize: Sequelize,
	sequelize: sequelize,
	namespace
};

let models = [];

/**
 * 父级模型
 */
class BaseModel extends Sequelize.Model {
	static getSchema() {
		let r = {}
		_.mapKeys(this.rawAttributes, (value, key) => {

			r[key] = {
				type: value.type.key,
				length: value.type._length || -1,
				validators: value.validators || {}
			}
		})
		return r
	}
	static init(attributes, options) { // 定义公共部分
		attributes = _.extend({
			id: {
				type: DataTypes.STRING(32),
				primaryKey: true,
				field: "id",
				defaultValue: ()=> {
					return uuid.v4().replace(/-/g, "")
				},
				validate: {
					len: 32
				}
			}
		}, attributes)

		options.hooks = options.hooks || {}
		super.init(attributes, options)
	}
}

sequelize.BaseModel = BaseModel
sequelize.define = function (modelName, attributes, options) {
	options.modelName = modelName;
	options.sequelize = this;
	const model = class extends BaseModel {};
	model.init(attributes, options);

	return model;
}

fs
	.readdirSync(__dirname)
	.filter(function (file) {
		return (file.indexOf(".") !== 0) && (file !== basename);
	})
	.forEach(function (file) {

		let model = sequelize.import(path.join(__dirname, file));

		// 包裹model
		models.push(model);
		dbs[model.name] = model;
		debug(model.name);
	});

models.forEach(model => {
	model.associate && model.associate(dbs);
});

if (conf.mysql.sync && conf.mysql.sync.enabled)
	sequelize.sync(conf.mysql.sync.options, {
		match: conf.mysql.sync.match
	}).then(function () {
		debug("sequelize sync success.");
	}).catch(function (err) {
		debug("sequelize sync error:", err);
	});


module.exports = dbs;