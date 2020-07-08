const db = require("../../models");

/**
 * 第一个参数是db repository
 */
module.exports = {
    getById: async (userId) => {
        if(!userId) throw new RequiredArgsGeneralityError("必须存在参数 userId")
        return await db.user.findByPk(userId)
    },
    regist: async (userinfo) => {
        let r = await db.user.create(userinfo)
        return r
    },
    login: async (logininfo) => {
        if (!logininfo) throw new RequiredArgsGeneralityError("必须存在参数 logininfo")
        if (!_.isObject(logininfo)) throw new TypeArgsGeneralityError("参数 logininfo 必须是 object 类型")
        if (!logininfo.password) throw new RequiredArgsGeneralityError("必须存在参数 logininfo.password")
        if (!_.isString(logininfo.password)) throw new TypeArgsGeneralityError("参数 logininfo.password 必须是 string 类型")
        if (!logininfo.username) throw new RequiredArgsGeneralityError("必须存在参数 logininfo.username")
        if (!_.isString(logininfo.username)) throw new TypeArgsGeneralityError("参数 logininfo.username 必须是 string 类型")
        let query = {}
        let queryConf = [{
            name: "email",
            pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/i
        }, {
            name: "phone",
            pattern: /^(13[0-9]{1}|14[5|7|9]{1}|15[0-3|5-9]{1}|166|17[0-3|5-8]{1}|18[0-9]{1}|19[8-9]{1}){1}\d{8}$/i
        }, {
            name: "username",
            pattern: /^.*$/
        }]
        query = queryConf.find(c => c.pattern.test(logininfo.username))
        if (!query) throw new InvalidArgsGeneralityError("参数 logininfo.username 的值是无效的")
        
        let user = await db.user.scope("enabled").findOne({
            where: {
                [query.name]: logininfo.username
            }
        })

        if (!user) throw new IsNullDataGeneralityError(`用户 ${logininfo.username} 不存在`)
        user.verify(logininfo.password)
        return user
    },
    updatePwd: async (userId, oldPassword, newPassword)=> {
        if (!userId) throw new RequiredArgsGeneralityError("必须存在参数 userId")
        if (!_.isString(userId)) throw new TypeArgsGeneralityError("参数 userId 必须是一个 UUID4 类型的字符串")
        if (!oldPassword) throw new RequiredArgsGeneralityError("必须存在参数 oldPassword")
        if (!_.isString(oldPassword)) throw new TypeArgsGeneralityError("参数 oldPassword 必须是一个字符串")
        if (!newPassword) throw new RequiredArgsGeneralityError("必须存在参数 newPassword")
        if (!_.isString(newPassword)) throw new TypeArgsGeneralityError("参数 newPassword 必须是一个字符串")

        let user = await db.user.findByPk(userId)
        user.verify(oldPassword)
        return await user.updatePwd(newPassword)
    },
    resetPwd: async (userId, password)=> {
        if (!userId) throw new RequiredArgsGeneralityError("必须存在参数 userId")
        if (!_.isString(userId)) throw new TypeArgsGeneralityError("参数 userId 必须是一个 UUID4 类型的字符串")
        if (!password) throw new RequiredArgsGeneralityError("必须存在参数 password")
        if (!_.isString(password)) throw new TypeArgsGeneralityError("参数 password 必须是一个字符串")
        
        let user = await db.user.findByPk(userId)
        return await user.resetPwd(password)
    }

};