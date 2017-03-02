var api = require("./api.js");
var conf = require("../../config");


api.createPool(conf.mysql);

module.exports = api;