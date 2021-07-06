const db = require("lib/service/couchdb")
const util = require("lib/service/couchdb/util")
const bottle = require("./bottle")
const debug = require("debug")("version.bfh.zdbx.net:container")


module.exports = {
    update: async (container) => {
        let _id = "container:" + container.id
        debug("update container " + _id)
        await db.atomic("general", "incrementUpdate", _id, {
            _id,
            value: container
        })
        let docs = await db.partitionedFind("bottle", {
            selector: {
                value: {
                    container_id: container.id
                }
            },
            limit: 10000,
            fields: ["_id", "value.id"]
        })
        await util.splitEach(docs.docs, 100, async (doc) => {
            doc.value.container = container // 更新内容
            return await bottle.update(doc.value)
        })
    },
    insert: async (container) => {
        return await db.insert({
            _id: "container:" + container.id,
            value: container
        })
    }
}