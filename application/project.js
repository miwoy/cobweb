const db = require("lib/service/couchdb")
const util = require("lib/service/couchdb/util")
const debug = require("debug")("version.bfh.zdbx.net: project")

module.exports = {
    update: async (project) => {
        let _id = "project:" + project.id
        debug("update project " + _id)
        return await db.atomic("general", "incrementUpdate", _id, {
            _id,
            value: project
        })
    },
    insert: async (project) => {
        return await db.insert({
            _id: "project:" + project.id,
            value: project
        })
    }
}