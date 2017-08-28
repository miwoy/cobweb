import fs from "fs";
import path from "path";
import common from "../lib/common";
// import db from "../models";

const basename = path.basename(module.filename);
let business;


if (!business) {
    business = {};
    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(function(file) {
            let _export = require(path.join(__dirname, file));
            let prop = file.split(".js")[0];
            business[prop] = _export();
            // Object.defineProperty(business, prop, {
            //     get: function() {
            //         return new _Class({
            //             db: db,
            //             common: common
            //         });
            //     }
            // });
        });
}

export default business;
