const fs = require('fs')
const path = require('path')
const config = require("../config");


if (config.uploadDir) { // 初始化上传目录
    if (!fs.existsSync(config.uploadDir)) {
        fs.mkdirSync(config.uploadDir)
    }
}