let customError;

/**
 * 父级程序异常类
 * @param {[type]} msg   [description]
 * @param {[type]} contr [description]
 */
class AbstractError extends Error {
	constructor(msg) {
		super(msg);
		Error.captureStackTrace(this, this);
		this.name = "CustomError";
		this.errno = 1000;
	}


}

/**
 * 认证异常
 * @param {[type]} msg   [description]
 * @param {[type]} contr [description]
 */
class AuthError extends AbstractError {
	constructor(msg) {
		super(msg || "用户认证失败");
		this.name = "AuthError";
		this.errno = 401;
	}
}

/**
 * 权限校验异常
 * @param {[type]} msg   [description]
 * @param {[type]} contr [description]
 */
class VerifyError extends AbstractError {
	constructor(msg) {
		super(msg || "权限校验失败");
		this.name = "VerifyError";
		this.errno = 403;
	}
}

/**
 * 服务器未处理异常
 * @param {[type]} msg   [description]
 * @param {[type]} contr [description]
 */
class UnknownError extends AbstractError {
	constructor(msg) {
		super(msg || "服务器异常");
		this.name = "UnknownError";
		this.errno = 500;
	}
}


customError = {
	AbstractError,
	AuthError,
	VerifyError,
	UnknownError
};

// 加载子异常类
require("./GeneralityError")(customError);
require("./RefError")(customError);

module.exports = customError;
