const user = require("./impl/user")


module.exports = (db) => {
	return {
		getById: async (userId) => {
			return await user.getById(userId)
		},
		regist: async (userinfo) => {
			return await db.sequelize.transaction(async t1 => {
				return await user.regist(userinfo)
			})
		},
		login: async (loginfo) => {
			return await user.login(loginfo)
		},
		updatePwd: async (userId, oldPassword, newPassword) => {
			return await user.updatePwd(userId, oldPassword, newPassword)
		},
		resetPwd: async (userId, password) => {
			return await user.resetPwd(userId, password)
		}
	}
}