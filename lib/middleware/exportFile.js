const uuid = require("uuid");
module.exports = async function exportFile(ctx, next) {
    await next();
    /**
     * 在使用该中间件做文件下载时，ctx.sbody 接受一个 object
     * object 有如下属性
     * object.filename 文件名，默认生成一个无后缀的uuidv4的名称
     * object.buffer 文件内容
     */
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.set("Content-Disposition", "attachment; filename* = UTF-8''" + (ctx.sbody.data.filename || uuid.v4()));    
    ctx.body = ctx.sbody.data.buffer;
}
