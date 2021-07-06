const db = require("lib/service/couchdb")
const util = require("lib/service/couchdb/util")
const bottle = require("./bottle")
const debug = require("debug")("version.bfh.zdbx.net:donor")


module.exports = {
    update: async (donor) => {
        let _id = "donor:" + donor.id
        debug("update donor " + _id)
        await db.atomic("general", "incrementUpdate", _id, {
            _id,
            value: donor
        })
        let docs = await db.partitionedFind("bottle", {
            selector: {
                value: {
                    donor_id: donor.id
                }
            },
            limit: 10000,
            fields: ["_id", "value.id"]
        })
        await util.splitEach(docs.docs, 100, async (doc) => {
            doc.value.donor = donor // 更新内容
            return await bottle.update(doc.value)
        })
    },
    insert: async (donor) => {
        return await db.insert({
            _id: "donor:" + donor.id,
            value: donor
        })
    }
}