import fs from "fs";
import path from "path";
import factoryMaster from "node-entities";
import common from "../lib/common";

const basename = path.basename(module.filename);
let models;


if (!models) {
    models = {};
    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(function(file) {
            let _Class = require(path.join(__dirname, file));
            let prop = common.util.convertP2C(file.split(".js")[0])
            models[prop] = _Class;
            // Object.defineProperty(models, prop, {
            //     get: function() {
            //         return new _Class({
            //             db: db,
            //             common: common
            //         });
            //     }
            // });
        });
}
// 初始化，并返回工厂构造器 
let Factory = factoryMaster.init(conf.mysql, models);

let factory = new Factory();
export default factoryMaster.export();
