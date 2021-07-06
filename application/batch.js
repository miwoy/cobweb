const db = require("lib/service/couchdb")
const util = require("lib/service/couchdb/util")
const bottle = require("./bottle")
const debug = require("debug")("version.bfh.zdbx.net:batch")


module.exports = {
    update: async (batch) => {
        let _id = "batch:" + batch.id
        debug("update batch " + _id)
        await db.atomic("general", "incrementUpdate", _id, {
            _id,
            value: batch
        })

        let docs = await db.partitionedFind("bottle", {
            selector: {
                value: {
                    batch_id: batch.id
                }
            },
            limit: 10000,
            fields: ["_id", "value.id"]
        })

        await util.splitEach(docs.docs, 100, async (doc) => {
            doc.value.batch = batch // 更新内容
            return await bottle.update(doc.value)
        })
    },
    insert: async (batch) => {
        return await db.insert({
            _id: "batch:" + batch.id,
            value: batch
        })
    }

}