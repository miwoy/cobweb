/**
 * @apiDefine Success 响应成功
 * @apiSuccess {Number} errno=0  错误代码，默认0为成功
 * @apiSuccess {String} errmsg=ok 错误信息，默认‘ok’为成功
 */

/**
 * @apiDefine Error 响应失败
 * @apiError (Error Status 200) {Number} errno=3200  错误代码
 * @apiError (Error Status 200) {String} errmsg=参数异常 错误信息
 */

/**
 * @apiDefine ErrorExample 异常响应示例
 * @apiErrorExample {json} 异常返回:
 * {
 *     "errno": 3001,
 *     "errmsg": "参数异常"
 * }
 */ 