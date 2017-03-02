import Router from "koa-router";

/**
 * 会员管理接口
 * <br/>prefix: /user
 * @class user
 */
let router = new Router();


/**
 * 获取会员列表 
 * #### POST: /api/a/user/getUsers
 * @method getUsers
 * @param {Object} config A config object
 * @param {Function} config.callback A callback function on the config object
 * @param {Boolean} [extra=false] Do extra, optional work
 * @return {Object} Returns the constructed target object
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
