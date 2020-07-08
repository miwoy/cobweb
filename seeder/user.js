const {
    user
} = require("models")
const { md5 } = require("../lib/common/encrypt.js")

module.exports = async (t)=> {
    let userIns = await user.scope().findCreateFind({
        where: {
            username: "miwoes"
        },
        defaults: {
            username: "miwoes",
            name: "管考博",
            password: md5("@miwoes"),
            enabled: true
        },
        transaction: t
    })
    return userIns[0];
}