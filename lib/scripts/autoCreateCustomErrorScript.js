var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');
var x = require("x-flow");

// 读取参数
var args = process.argv.splice(2).length > 0 ? process.argv.splice(2) : [path.resolve(__dirname, "./data/customError.xlsx")];
if (!fs.existsSync(args[0])) return console.log("参数错误：文件" + args[0] + "不存在");

var savePath = args[1] || args[0].substring(0, args[0].indexOf('/') + 1);

if (!fs.existsSync(savePath)) {
    savePath = args[0].substring(0, args[0].indexOf('/') + 1);
}

if (savePath.length <= 0) savePath += "./";
if (savePath[savePath.length - 1] !== "/") savePath += "/";

// 根据参数读取xls or xlsx 
var list = xlsx.parse(args[0]);

var list = list[0].data; // sheet1数据部分

/**
 * 1.创建文件
 * 2.创建代码部分，规则
 * 3.共有代码部分
 * 4.创建文件夹
 */


// 格式化list

var _propNames = list[0];

var items = [];

for (var i = 1; i < list.length; i++) {
    var _obj = {};
    for (var j = 0; j < list[i].length; j++) {
        _obj[_propNames[j % 5]] = list[i][j];
    }

    items.push(_obj);
}

var file;
var filepath = "./lib/global/error/"
var AbstractErrorName;
var preErrorName;
for (var i = 1; i < items.length; i++) {
    if (items[i].errno % 1000 === 0) {
        console.log(items[i].errno)
            // 保存文件
        if (file) {
            file.content += "}";
            if (!fs.existsSync(filepath)) {
                fs.mkdirSync(filepath)
            }

            fs.writeFileSync(filepath + file.name + ".js", file.content);
        }

        // 创建新文件
        var file = {};
        AbstractErrorName = "customError.AbstractError";
        preErrorName = "customError.AbstractError";
        file.name = items[i].name;
        file.content = "var util = require('util');\n\n\n" +
            "export default function(customError) {\n";
    }

    file.content += "/**\n" +
        "* " + items[i]["描述"] + "\n" +
        "*/\n" +
        "class " + items[i].name + " extends " + (items[i].errno % 100 === 0 ? preErrorName : AbstractErrorName) + "{\n" +
        "constructor(msg) {\n" +
        "super(\"" + items[i].message + ".\" + (msg || \"\"" +
        "));\n" +
        "this.name = \"" + items[i].name + "\";\n" +
        "this.errno = " + items[i].errno + ";\n" +
        "}\n" +
        "}\n" +
        "customError." + items[i].name + " = " + items[i].name + ";\n";
    if (items[i].errno % 1000 === 0) preErrorName = items[i].name;

    if (items[i].errno % 100 === 0) AbstractErrorName = items[i].name;


}

if (file) {
    file.content += "}";
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath)
    }

    fs.writeFileSync(filepath + file.name + ".js", file.content);
}

// 代码部分