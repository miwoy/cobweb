import Router from "koa-router";
import {oss} from "../lib/service/aliyun";

/**
 * 阿里云接口
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
router.get('/oss/getToken', async function(ctx, next) {
	let r = await oss.getToken();
	ctx.body = r;
});


export default router;
