const _ = require("lodash");

/**
 * 第一个参数是db repository
 */
module.exports = {
	otherApi: async function(db) {
		return await db.test.findAll()
	},
	move: async function(db, id, preId, altId) {
		return await db.test.move(id, preId, altId)
	}
};
