import Router from "koa-router";

/**
 * 会员管理接口
 * <br/>prefix: /test
 * @class test
 */
let router = new Router();


/**
 * 获取会员列表 
 * #### POST: /api/template/test/getTests
 * @method getTests
 * @param {Object} obj 这是一个对象参数例子
 * @param {Function} obj.callback 这是一个内嵌对象例子
 * @param {Boolean} [extra=false] 这是一个选填默认值参数
 * @return {Object} Returns 这是返回值例子
 * ````
 *	{
 *		errno: 0,
 *		errmsg: "ok",
 *		data: <数据>
 *		[totalCount]: <总条数>
 *	}
 * ````
 */
router.get('/getTests', async function(ctx, next) {
    let test = ctx.business.test;
    var r = await test.getTests();
    ctx.body = r;
});

router.post('/setTest', async function(ctx, next) {
    let test = ctx.business.test;
    let r = await test.setTest();
    ctx.body = r
});

router.post('/begin', async function(ctx, next) {
    let test = ctx.business.test;
    let r = await test.begin();
    ctx.body = r;
})


export default router;
