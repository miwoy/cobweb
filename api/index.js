import Router from "koa-router";
import business from "../business";
import fs from "fs";
import path from "path";
import util from "../lib/common";

const basename = path.basename(module.filename);
let router = new Router();

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== basename);
    })
    .forEach(function(file) {
        var _router = require(path.join(__dirname, file));
        router.use(_router.routes(), _router.allowedMethods());
    });

export default router;