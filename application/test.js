const test = require("./impl/test")


module.exports = (db, common) => {
	return {
		otherApi: async ()=> {
			return await test.otherApi(db)
		},
		move: async (id, preId, altId)=> {
			return await test.move(db, id, preId, altId)
		}
	}
}
