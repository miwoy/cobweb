var util = require('util');


export default function(customError) {
/**
* 引用外部库或外部程序时，非程序内部导致的错误异常
*/
class RefError extends customError.AbstractError{
constructor(msg) {
super("引用异常." + (msg || ""));
this.name = "RefError";
this.errno = 2000;
}
}
customError.RefError = RefError;
/**
* 由JPush请求时的错误
*/
class JPushRefError extends RefError{
constructor(msg) {
super("JPush请求失败." + (msg || ""));
this.name = "JPushRefError";
this.errno = 2001;
}
}
customError.JPushRefError = JPushRefError;
/**
* 由QiNiu请求时引发的错误
*/
class QiNiuRefError extends RefError{
constructor(msg) {
super("QiNiu请求失败." + (msg || ""));
this.name = "QiNiuRefError";
this.errno = 2002;
}
}
customError.QiNiuRefError = QiNiuRefError;
/**
* 由YunPian请求时引发的错误
*/
class YunPianRefError extends RefError{
constructor(msg) {
super("YunPian请求失败." + (msg || ""));
this.name = "YunPianRefError";
this.errno = 2003;
}
}
customError.YunPianRefError = YunPianRefError;
/**
* 所有MySQL访问异常封装
*/
class MySqlRefError extends RefError{
constructor(msg) {
super("MySql异常." + (msg || ""));
this.name = "MySqlRefError";
this.errno = 2100;
}
}
customError.MySqlRefError = MySqlRefError;
/**
* 网络连接失败或中断，无效连接时的异常对象
*/
class DisconnectedMysqlRefError extends MySqlRefError{
constructor(msg) {
super("网络连接中断." + (msg || ""));
this.name = "DisconnectedMysqlRefError";
this.errno = 2101;
}
}
customError.DisconnectedMysqlRefError = DisconnectedMysqlRefError;
/**
* 网络链接超时
*/
class TimeOutConnectMySqlRefError extends MySqlRefError{
constructor(msg) {
super("网络连接超时." + (msg || ""));
this.name = "TimeOutConnectMySqlRefError";
this.errno = 2102;
}
}
customError.TimeOutConnectMySqlRefError = TimeOutConnectMySqlRefError;
/**
* 执行原生sql语句时发生的错误
*/
class QueryMySQLRefError extends MySqlRefError{
constructor(msg) {
super("sql语句执行错误." + (msg || ""));
this.name = "QueryMySQLRefError";
this.errno = 2103;
}
}
customError.QueryMySQLRefError = QueryMySQLRefError;
/**
* 数据查询时错误
*/
class FindMySqlRefError extends MySqlRefError{
constructor(msg) {
super("数据查询失败." + (msg || ""));
this.name = "FindMySqlRefError";
this.errno = 2104;
}
}
customError.FindMySqlRefError = FindMySqlRefError;
/**
* 数据新增失败
*/
class CreateMySqlRefError extends MySqlRefError{
constructor(msg) {
super("数据新增失败." + (msg || ""));
this.name = "CreateMySqlRefError";
this.errno = 2105;
}
}
customError.CreateMySqlRefError = CreateMySqlRefError;
/**
* 数据更新失败
*/
class ModifyMySqlRefError extends MySqlRefError{
constructor(msg) {
super("数据更新失败." + (msg || ""));
this.name = "ModifyMySqlRefError";
this.errno = 2106;
}
}
customError.ModifyMySqlRefError = ModifyMySqlRefError;
/**
* 数据删除失败
*/
class DelMySqlRefError extends MySqlRefError{
constructor(msg) {
super("数据删除失败." + (msg || ""));
this.name = "DelMySqlRefError";
this.errno = 2107;
}
}
customError.DelMySqlRefError = DelMySqlRefError;
/**
* 事务错误
*/
class TransactionMySqlError extends MySqlRefError{
constructor(msg) {
super("事务错误." + (msg || ""));
this.name = "TransactionMySqlError";
this.errno = 2108;
}
}
customError.TransactionMySqlError = TransactionMySqlError;
/**
* 使用mongodb时由mongodb引发的异常
*/
class MongoRefError extends RefError{
constructor(msg) {
super("mongodb异常." + (msg || ""));
this.name = "MongoRefError";
this.errno = 2200;
}
}
customError.MongoRefError = MongoRefError;
/**
* 网络连接失败或中断，无效连接时的异常对象
*/
class DisconnectedMongoRefError extends MongoRefError{
constructor(msg) {
super("网络连接中断." + (msg || ""));
this.name = "DisconnectedMongoRefError";
this.errno = 2201;
}
}
customError.DisconnectedMongoRefError = DisconnectedMongoRefError;
/**
* 网络连接超时
*/
class TimeOutConnectMongoRefError extends MongoRefError{
constructor(msg) {
super("网络连接超时." + (msg || ""));
this.name = "TimeOutConnectMongoRefError";
this.errno = 2202;
}
}
customError.TimeOutConnectMongoRefError = TimeOutConnectMongoRefError;
/**
* 数据查询失败
*/
class FindMongoRefError extends MongoRefError{
constructor(msg) {
super("数据查询失败." + (msg || ""));
this.name = "FindMongoRefError";
this.errno = 2203;
}
}
customError.FindMongoRefError = FindMongoRefError;
/**
* 数据新增失败
*/
class CreateMongoRefError extends MongoRefError{
constructor(msg) {
super("数据新增失败." + (msg || ""));
this.name = "CreateMongoRefError";
this.errno = 2204;
}
}
customError.CreateMongoRefError = CreateMongoRefError;
/**
* 数据更新失败
*/
class ModifyMongoRefError extends MongoRefError{
constructor(msg) {
super("数据更新失败." + (msg || ""));
this.name = "ModifyMongoRefError";
this.errno = 2205;
}
}
customError.ModifyMongoRefError = ModifyMongoRefError;
/**
* 数据删除失败
*/
class DelMongoRefError extends MongoRefError{
constructor(msg) {
super("数据删除失败." + (msg || ""));
this.name = "DelMongoRefError";
this.errno = 2206;
}
}
customError.DelMongoRefError = DelMongoRefError;
/**
* 操作IO时引发的异常
*/
class IORefError extends RefError{
constructor(msg) {
super("IO操作错误." + (msg || ""));
this.name = "IORefError";
this.errno = 2300;
}
}
customError.IORefError = IORefError;
/**
* 封装常用的WeChatAPI异常处理
*/
class WeChatRefError extends RefError{
constructor(msg) {
super("WeChat调用错误." + (msg || ""));
this.name = "WeChatRefError";
this.errno = 2400;
}
}
customError.WeChatRefError = WeChatRefError;
/**
* 网络连接失败或中断，无效连接时的异常对象
*/
class DisconnectedWeChatRefError extends WeChatRefError{
constructor(msg) {
super("网络连接中断." + (msg || ""));
this.name = "DisconnectedWeChatRefError";
this.errno = 2401;
}
}
customError.DisconnectedWeChatRefError = DisconnectedWeChatRefError;
/**
* 网络连接超时
*/
class TimeOutConnectWeChatRefError extends WeChatRefError{
constructor(msg) {
super("网络连接超时." + (msg || ""));
this.name = "TimeOutConnectWeChatRefError";
this.errno = 2402;
}
}
customError.TimeOutConnectWeChatRefError = TimeOutConnectWeChatRefError;
/**
* 发送模板消息失败错误
*/
class SendTemplateWeChatRefError extends WeChatRefError{
constructor(msg) {
super("发送模板消息错误." + (msg || ""));
this.name = "SendTemplateWeChatRefError";
this.errno = 2403;
}
}
customError.SendTemplateWeChatRefError = SendTemplateWeChatRefError;
/**
* code不可用
*/
class InvalidCodeWeChatRefError extends WeChatRefError{
constructor(msg) {
super("无效的code." + (msg || ""));
this.name = "InvalidCodeWeChatRefError";
this.errno = 2404;
}
}
customError.InvalidCodeWeChatRefError = InvalidCodeWeChatRefError;
/**
* 退款失败
*/
class RefundWeChatRefError extends WeChatRefError{
constructor(msg) {
super("退款失败." + (msg || ""));
this.name = "RefundWeChatRefError";
this.errno = 2405;
}
}
customError.RefundWeChatRefError = RefundWeChatRefError;
/**
* redis异常
*/
class RedisRefError extends RefError{
constructor(msg) {
super("Redis错误." + (msg || ""));
this.name = "RedisRefError";
this.errno = 2500;
}
}
customError.RedisRefError = RedisRefError;
/**
* redis连接异常
*/
class ConnectedRedisRefError extends RedisRefError{
constructor(msg) {
super("redis连接错误." + (msg || ""));
this.name = "ConnectedRedisRefError";
this.errno = 2501;
}
}
customError.ConnectedRedisRefError = ConnectedRedisRefError;
/**
* set异常
*/
class SetRedisRefError extends RedisRefError{
constructor(msg) {
super("set错误." + (msg || ""));
this.name = "SetRedisRefError";
this.errno = 2502;
}
}
customError.SetRedisRefError = SetRedisRefError;
/**
* get异常
*/
class GetRedisRefError extends RedisRefError{
constructor(msg) {
super("get错误." + (msg || ""));
this.name = "GetRedisRefError";
this.errno = 2503;
}
}
customError.GetRedisRefError = GetRedisRefError;
}