const db = require("lib/service/couchdb")
const util = require("lib/service/couchdb/util")
const dottie = require("dottie")
const debug = require("debug")("version.bfh.zdbx.net:bottle")


module.exports = {
    update: async (bottle) => {
        let _id = "bottle:" + bottle.id
        debug("update bottle " + _id)
        return await db.atomic("general", "incrementUpdate", _id, dottie.flatten({
            _id,
            value: bottle
        }))
    },
    insert: async (bottle) => {
        let props = ["donor", "container", "sample", "sampleSource"]

        let result = await db.find({
            selector: {
                _id: {
                    "$in": props.map(prop => prop + ":" + bottle[prop+"_id"])
                }
            }
        })
        result.docs.forEach(doc => {
            bottle[doc._id.split(":")[0]] = doc.value
        })
        return await db.insert({
            _id: "bottle:" + bottle.id,
            value: bottle
        })

    }

}