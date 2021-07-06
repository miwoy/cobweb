const db = require("lib/service/couchdb")
const util = require("lib/service/couchdb/util")
const bottle = require("./bottle")
const debug = require("debug")("version.bfh.zdbx.net:sampleSource")


module.exports = {
    update: async (sampleSource) => {
        let _id = "sampleSource:" + sampleSource.id
        debug("update sampleSource " + _id)
        await db.atomic("general", "incrementUpdate", _id, {
            _id,
            value: sampleSource
        })
        let docs = await db.partitionedFind("bottle", {
            selector: {
                value: {
                    sampleSource_id: sampleSource.id
                }
            },
            limit: 10000,
            fields: ["_id", "value.id"]
        })
        await util.splitEach(docs.docs, 100, async (doc) => {
            doc.value.sampleSource = sampleSource // 更新内容
            return await bottle.update(doc.value)
        })
    },
    insert: async (sampleSource) => {
        return await db.insert({
            _id: "sampleSource:" + sampleSource.id,
            value: sampleSource
        })
    }
}