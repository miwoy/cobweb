var api = require("./api.js");
var conf = require("../../config");

/**
host: 'host',
port: '3306',
user: 'username',
password: 'password',
database: 'dbname',
connectionLimit: 20,
supportBigNumbers: true
 */

api.createPool(conf.mysql);

module.exports = api;
