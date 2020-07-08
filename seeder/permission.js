const {
    permission
} = require("models")
const {
    splitRouter
} = require("lib/common/util")
const router = require("routes/api")
const limit = 1000
let permissions = []

module.exports = async (t) => {
    if (permissions.length>0) return permissions
    // 同步路由权限至数据库
    let permissionData = router.stack.reduce((total, layer) => {
        if (!layer.name) {} else {
            let codes = splitRouter(layer.name)
            codes.map(c=>{
                if (!total.find(t=>t.code==c)) total.push({
                    code: c,
                    name: c
                })
            })
            
        }
        return total
    }, [])
    let offset=0

    while(offset<permissionData.length) {
        let _permissions = await permission.scope().bulkCreate(permissionData.slice(offset, offset + limit), {
            transaction: t
        })
        permissions = permissions.concat(_permissions)
        offset+=limit
    }
    return permissions
}