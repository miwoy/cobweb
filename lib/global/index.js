import _ from "lodash";
import fs from "fs";
import path from "path";

const basename = path.basename(module.filename);

let _global = {};
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {

        // loading global object
        let _module = require(path.join(__dirname, file));
        _global = _.assign(_global, _module);
    });

// init global
_.each(_global, function(v, k) {
    if (!global[k]) global[k] = v;
});
