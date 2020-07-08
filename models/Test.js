const {
	functionsIn
} = require("lodash");

// 每层 100 最多 10层
const MAX_DEPTH = 8
let parent = {
	lft: 0,
	rgt: 100 ** MAX_DEPTH - 1,
	depth: 0
}

/**
 * @model test
 */
module.exports = (sequelize, DataTypes) => {
	class Test extends sequelize.BaseModel {}
	Test.init({
		name: {
			type: DataTypes.STRING(10),
			validators: {
				isEmail: true
			}
		},
		desc: {
			type: DataTypes.STRING(100)
		},
		lft: {
			type: DataTypes.DECIMAL(16, 0),
			get() {
				return this.getDataValue("lft") * 1
			},
			set() {

			}
		},
		rgt: {
			type: DataTypes.DECIMAL(16, 0),
			get() {
				return this.getDataValue("rgt") * 1
			},
			set() {

			}
		},
		depth: {
			type: DataTypes.INTEGER,
			set() {

			}
		}
	}, {
		sequelize,
		modelName: "test",
		hooks: {
			async beforeCreate(data) {
				let brotherCount = 0
				if (data.parentId) {
					parent = await data.getParent()
				}

				brotherCount = await Test.count({
					where: {
						depth: parent.depth + 1
					}
				})

				data.setDataValue("depth", parent.depth + 1)
				data.setDataValue("lft", parent.lft + brotherCount * 100 ** (MAX_DEPTH - data.depth))
				data.setDataValue("rgt", data.lft * 1 + 100 ** (MAX_DEPTH - data.depth) - 1)

				if (data.depth > MAX_DEPTH) throw new Error("层级溢出，最多为10层")
				if (data.rgt > parent.rgt) throw new Error("边界溢出，同层最多只能存在100条数据")
				return data

			}
		}
	});

	Test.associate = function (models) {
		this.hasMany(models.test, {
			foreignKey: "parentId",
			onDelete: "CASCADE",
			as: "children"
		})
		this.belongsTo(models.test, {
			foreignKey: "parentId",
			as: "parent"
		})
	}

	Test.move = async function (id, preId, altId) {
		let datas = await this.findAll({
			where: {
				id: [id, preId, altId]
			},
			attributes: ["id", "lft", "rgt", "depth"],
			include: {
				model: Test,
				as: "parent",
				required: false,
				attributes: ["id", "lft", "rgt", "depth"],
			}
		})

		let data, pre, alt, temp, unit
		datas.map(d => {
			if (d.id == id) data = d
			else if (d.id == preId) pre = d
			else if (d.id == altId) alt = d
		})
		data.parent = data.parent || parent
		unit = 100 ** (MAX_DEPTH - data.depth)
		temp = {
			lft: data.parent.lft + 99 * unit,
			rgt: data.parent.lft + 99 * unit + unit - 1
		}
		// data.lft > alt.rgt 前
		// data.rgt < pre.lft 后
		await sequelize.transaction(async t1 => {
			if (alt && data.lft > alt.rgt) { // 向前移动
				await this.scope().increment({
					lft: temp.lft - data.lft,
					rgt: temp.rgt - data.rgt
				}, {
					where: {
						lft: {
							"$gte": data.lft,
						},
						rgt: {
							"$lte": data.rgt
						},
						depth: {
							"$gte": data.depth
						}
					},
					transaction: t1
				})
				await this.scope().increment({
					lft: unit,
					rgt: unit
				}, {
					where: {
						lft: {
							"$gte": alt.lft,
						},
						rgt: {
							"$lt": data.lft
						},
						depth: {
							"$gte": data.depth
						}
					},
					transaction: t1
				})

				await this.scope().decrement({
					lft: temp.lft - alt.lft,
					rgt: temp.rgt - alt.rgt
				}, {
					where: {
						lft: {
							"$gte": temp.lft,
						},
						rgt: {
							"$lte": temp.rgt
						},
						depth: {
							"$gte": data.depth
						}
					},
					transaction: t1
				})
			} else if (pre && data.rgt < pre.lft) { // 向后移动
				await this.scope().increment({
					lft: temp.lft - data.lft,
					rgt: temp.rgt - data.rgt
				}, {
					where: {
						lft: {
							"$gte": data.lft,
						},
						rgt: {
							"$lte": data.rgt
						},
						depth: {
							"$gte": data.depth
						}
					},
					transaction: t1
				})
				await this.scope().decrement({
					lft: unit,
					rgt: unit
				}, {
					where: {
						lft: {
							"$gt": data.rgt,
						},
						rgt: {
							"$lte": pre.rgt
						},
						depth: {
							"$gte": data.depth
						}
					},
					transaction: t1
				})
				await this.scope().decrement({
					lft: temp.lft - pre.lft,
					rgt: temp.rgt - pre.rgt
				}, {
					where: {
						lft: {
							"$gte": temp.lft,
						},
						rgt: {
							"$lte": temp.rgt
						},
						depth: {
							"$gte": data.depth
						}
					},
					transaction: t1
				})
			}
		})

		return true
	}

	const destroy = Test.destroy
	/**
	 * TODO 删除包含子节点
	 */
	Test.destroy = async function (options) {
		let trans
		if (!options.transaction) {
			trans = await sequelize.transaction()
			options.transaction = trans
		} else {
			trans = options.transaction
		}

		let _options = _.assign({}, options, {
			order: ["lft", "asc"],
			attributes: ["id", "lft", "rgt", "depth"]
		})

		let datas = await this.findAll(_options)
		await destroy.call(this, options)
		for (let i = 0; i < datas.length; i++) {
			await this.decrement({
				lft: datas[i].rgt - datas[i].lft,
				rgt: datas[i].rgt - datas[i].lft,
			}, {
				where: {
					depth: datas[i].depth,
					lft: {
						"$gt": datas[i].lft
					}
				},
				transaction: trans
			})
		}

	}

	return Test;
};