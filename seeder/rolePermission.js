const {
    rolePermission
} = require("models")
const role = require("./role")
const permission = require("./permission")

module.exports = async (t)=> {
    let roleIns = await role(t)
    let permissions = await permission(t)
    let permissionIns = permissions.find(p=>p.code==".*")
    let rolePermissionIns = await rolePermission.scope().create({
        scope: "ALL",
        permissionId: permissionIns.id, 
        roleId: roleIns.id
    }, {
        transaction: t
    })
    return rolePermissionIns;
}