const {
    role
} = require("models")
module.exports = async (t)=> {
    let roleIns = await role.scope().findCreateFind({
        where: {
            code: "admin"
        },
        defaults: {
            code: "admin",
            name: "管理员"
        },
        transaction: t
    })
    return roleIns[0];
}