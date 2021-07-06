require("./init")
const nano = require("./db")
module.exports = nano.use(conf.couchdb.database)

