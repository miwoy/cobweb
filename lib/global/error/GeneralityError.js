var util = require('util');


export default function(customError) {
/**
* 通用性异常类
*/
class GeneralityError extends customError.AbstractError{
constructor(msg) {
super("一般性错误." + (msg || ""));
this.name = "GeneralityError";
this.errno = 3000;
}
}
customError.GeneralityError = GeneralityError;
/**
* 参数错误
*/
class ArgsGeneralityError extends GeneralityError{
constructor(msg) {
super("参数错误." + (msg || ""));
this.name = "ArgsGeneralityError";
this.errno = 3100;
}
}
customError.ArgsGeneralityError = ArgsGeneralityError;
/**
* 参数类型错误
*/
class TypeArgsGeneralityError extends ArgsGeneralityError{
constructor(msg) {
super("参数类型错误." + (msg || ""));
this.name = "TypeArgsGeneralityError";
this.errno = 3101;
}
}
customError.TypeArgsGeneralityError = TypeArgsGeneralityError;
/**
* 参数个数有误
*/
class LengthArgsGeneralityError extends ArgsGeneralityError{
constructor(msg) {
super("参数个数有误." + (msg || ""));
this.name = "LengthArgsGeneralityError";
this.errno = 3102;
}
}
customError.LengthArgsGeneralityError = LengthArgsGeneralityError;
/**
* 参数值无效
*/
class InvalidArgsGeneralityError extends ArgsGeneralityError{
constructor(msg) {
super("无效的参数." + (msg || ""));
this.name = "InvalidArgsGeneralityError";
this.errno = 3103;
}
}
customError.InvalidArgsGeneralityError = InvalidArgsGeneralityError;
/**
* 当函数内调用其他函数返回的数据时与预期的数据不符而引发的错误
*/
class DataGeneralityError extends GeneralityError{
constructor(msg) {
super("数据错误." + (msg || ""));
this.name = "DataGeneralityError";
this.errno = 3200;
}
}
customError.DataGeneralityError = DataGeneralityError;
/**
* 数据类型错误
*/
class TypeDataGeneralityError extends DataGeneralityError{
constructor(msg) {
super("数据类型错误." + (msg || ""));
this.name = "TypeDataGeneralityError";
this.errno = 3201;
}
}
customError.TypeDataGeneralityError = TypeDataGeneralityError;
/**
* 不可使用的数据格式
*/
class InvalidDataGeneralityError extends DataGeneralityError{
constructor(msg) {
super("无效的数据." + (msg || ""));
this.name = "InvalidDataGeneralityError";
this.errno = 3202;
}
}
customError.InvalidDataGeneralityError = InvalidDataGeneralityError;
/**
* 调用函数时返回null数据导致无法完成逻辑时的错误
*/
class IsNullDataGeneralityError extends DataGeneralityError{
constructor(msg) {
super("空数据异常." + (msg || ""));
this.name = "IsNullDataGeneralityError";
this.errno = 3203;
}
}
customError.IsNullDataGeneralityError = IsNullDataGeneralityError;
}