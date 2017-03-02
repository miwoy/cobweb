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


// function AbstractError(msg, contr) {
//     Error.captureStackTrace(this, contr || this);
//     this.message = "custom error." + (msg || "");
// }

// util.inherits(AbstractError, Error);
// AbstractError.prototype.name = "CustomError";
// AbstractError.prototype.errno = 1000;



customError = {
    AbstractError: AbstractError
};

// 加载子异常类
require("./GeneralityError")(customError);
require("./RefError")(customError);

export default customError;
