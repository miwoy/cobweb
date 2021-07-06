const db = require("lib/service/couchdb")
const util = require("lib/service/couchdb/util")
const bottle = require("./bottle")
const debug = require("debug")("version.bfh.zdbx.net:sample")


module.exports = {
    update: async (sample) => {
        let _id = "sample:" + sample.id
        debug("update sample " + _id)
        await db.atomic("general", "incrementUpdate", _id, {
            _id,
            value: sample
        })
        let docs = await db.partitionedFind("bottle", {
            selector: {
                value: {
                    sample_id: sample.id
                }
            },
            limit: 10000,
            fields: ["_id", "value.id"]
        })

        await util.splitEach(docs.docs, 100, async (doc) => {
            doc.value.sample = sample // 更新内容
            return await bottle.update(doc.value)
        })
    },
    insert: async (sample) => {
        return await db.insert({
            _id: "sample:" + sample.id,
            value: sample
        })
    }
}