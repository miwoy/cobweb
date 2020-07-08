# cobweb

## 简介

基于koa2基础服务平台

----

###### 基础路径
> http://127.0.0.1:3000

###### 文档地址
> http://127.0.0.1:3000/docs/ 输出文档

## 调用说明

### 请求

请求动词约定：

*   HEAD: 验证资源
*   GET: 获取资源
*   POST: 创建资源
*   PUT: 更新资源
*   PATCH: 更新资源的一个属性
*   DELETE: 删除资源
*   OPTIONS: 获取客户端能对资源做什么操作的信息


参数传递方式

* query: url 参数传递方式

  ``` bash
  GET /tests?pageSize=10&pageIndex=1
  ```
* parmas: path 参数传递方式

  ``` bash
  GET /tests/:id
  ```

  

* body: 请求体参数传递方式

  ``` bash
  POST /tests \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "test name"
  }'
  ```

  

### 响应



正常返回

``` json
Status 200 ok;
{
  "errno": 0,
  "errmsg": "ok",
  "data": {
    "name": "test name"
  }
}
```



## 错误



### HTTP 状态码说明

| 状态码 | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| 200    | 操作资源成功，结果在服务器预期之内                           |
| 400    | 操作资源失败，失败原因为客户端使用错误                       |
| 401    | 认证失败                                                   |
| 403    | 无权限调用接口，原因可能为用户没有访问该资源权限             |
| 404    | 访问资源不存在，原因可能为url拼写错误或使用的 Method 错误    |
| 429    | 触达限流限制                                                 |
| 500    | 服务器错误，该问题是由服务器端产生错误，如服务器端代码bug，或服务器端访问其它资源受限 |
| 502    | 服务器无法连接，如服务器异常重启时，nginx会代理失败          |



### 错误码说明



在可预期范围内，服务器将尽可能的使用自定义异常返回，已便于更精准的定位错误原因。自定义异常包含业务异常，和客户端引起的异常，以及服务器端引起的异常。错误标识由返回体的`errno`与`errmsg`体现。



响应体结构：

``` json
{
  "errno": "<错误码>",
  "errmsg": "<错误信息>"
}
```



常用错误码

| errno | name                         | message          | 描述                                                         |
| ----- | ---------------------------- | ---------------- | ------------------------------------------------------------ |
| 1000  | AbstractError                | 内部异常         | 内部异常包括书写错误与逻辑错误，不需要手动处理，书写错误会直接导致程序崩溃，逻辑错误可能会在调用时引发其它异常。同时此异常为抽象异常类，其他自定义程序异常均以此异常为根 |
| 2000  | RefError                     | 引用异常         | 引用外部库或外部程序时，非程序内部导致的错误异常             |
| 2001  | JPushRefError                | JPush请求失败    | 由JPush请求时的错误                                          |
| 2002  | QiNiuRefError                | QiNiu请求失败    | 由QiNiu请求时引发的错误                                      |
| 2003  | YunPianRefError              | YunPian请求失败  | 由YunPian请求时引发的错误                                    |
| 2100  | MySqlRefError                | MySql异常        | 所有MySQL访问异常封装                                        |
| 2101  | DisconnectedMysqlRefError    | 网络连接中断     | 网络连接失败或中断，无效连接时的异常对象                     |
| 2102  | TimeOutConnectMySqlRefError  | 网络连接超时     | 网络链接超时                                                 |
| 2103  | QueryMySQLRefError           | sql语句执行错误  | 执行原生sql语句时发生的错误                                  |
| 2104  | FindMySqlRefError            | 数据查询失败     | 数据查询时错误                                               |
| 2105  | CreateMySqlRefError          | 数据新增失败     | 数据新增失败                                                 |
| 2106  | ModifyMySqlRefError          | 数据更新失败     | 数据更新失败                                                 |
| 2107  | DelMySqlRefError             | 数据删除失败     | 数据删除失败                                                 |
| 2108  | TransactionMySqlError        | 事务错误         | 事务错误                                                     |
| 2200  | MongoRefError                | mongodb异常      | 使用mongodb时由mongodb引发的异常                             |
| 2201  | DisconnectedMongoRefError    | 网络连接中断     | 网络连接失败或中断，无效连接时的异常对象                     |
| 2202  | TimeOutConnectMongoRefError  | 网络连接超时     | 网络连接超时                                                 |
| 2203  | FindMongoRefError            | 数据查询失败     | 数据查询失败                                                 |
| 2204  | CreateMongoRefError          | 数据新增失败     | 数据新增失败                                                 |
| 2205  | ModifyMongoRefError          | 数据更新失败     | 数据更新失败                                                 |
| 2206  | DelMongoRefError             | 数据删除失败     | 数据删除失败                                                 |
| 2300  | IORefError                   | IO操作错误       | 操作IO时引发的异常                                           |
| 2400  | WeChatRefError               | WeChat调用错误   | 封装常用的WeChatAPI异常处理                                  |
| 2401  | DisconnectedWeChatRefError   | 网络连接中断     | 网络连接失败或中断，无效连接时的异常对象                     |
| 2402  | TimeOutConnectWeChatRefError | 网络连接超时     | 网络连接超时                                                 |
| 2403  | SendTemplateWeChatRefError   | 发送模板消息错误 | 发送模板消息失败错误                                         |
| 2404  | InvalidCodeWeChatRefError    | 无效的code       | code不可用                                                   |
| 2405  | RefundWeChatRefError         | 退款失败         | 退款失败                                                     |
| 2500  | RedisRefError                | Redis错误        | redis异常                                                    |
| 2501  | ConnectedRedisRefError       | redis连接错误    | redis连接异常                                                |
| 2502  | SetRedisRefError             | set错误          | set异常                                                      |
| 2503  | GetRedisRefError             | get错误          | get异常                                                      |
| 3000  | GeneralityError              | 一般性错误       | 通用性异常类                                                 |
| 3100  | ArgsGeneralityError          | 参数错误         | 参数错误                                                     |
| 3101  | TypeArgsGeneralityError      | 参数类型错误     | 参数类型错误                                                 |
| 3102  | LengthArgsGeneralityError    | 参数个数有误     | 参数个数有误                                                 |
| 3103  | InvalidArgsGeneralityError   | 无效的参数       | 参数值无效                                                   |
| 3104  | RequiredArgsGeneralityError   | 不存在的参数       | 参数不存在                                                   |
| 3200  | DataGeneralityError          | 数据错误         | 当函数内调用其他函数返回的数据时与预期的数据不符而引发的错误 |
| 3201  | TypeDataGeneralityError      | 数据类型错误     | 数据类型错误                                                 |
| 3202  | InvalidDataGeneralityError   | 无效的数据       | 不可使用的数据格式                                           |
| 3203  | IsNullDataGeneralityError    | 空数据异常       | 调用函数时返回null数据导致无法完成逻辑时的错误               |
| 3204  | RequiredDataGeneralityError    | 不存在的数据       | Not found               |





## 字段类型

在文档中，我们将使用许多不同类型的数据。您可以在下方的说明列表找到它们的解释及示例。



| 类型    | 定义                                                         | 范例                       |
| :------ | :----------------------------------------------------------- | :------------------------- |
| int     | 整数，不带小数的数字。                                       | 1234                       |
| float   | 浮点数，带小数的数字。                                       | 1234.12                    |
| string  | 字符串是用于表示文本的字符序列。                             | "TEST"                   |
| boolean | 布尔值，是 `true` 或 `false` 中的一个，所对应的关系就是真与假的概念。 | true                       |
| time    | 表示日期和时间的字符串。                                     | "2017-09-10 12:23:01"      |
| array   | 列表，该列表为数组，数组中的每一项的类型由中括号内的字段类型决定。 | ["TEST1", "TEST2", "TEST3"] |
| object  | 资源，可从对应的资源 XX 对象中找到。                         |                            |

## 分页

所有列表接口使用都是用`pageSize/pageIndex`方式进行分页显示

* pageIndex 默认1
* pageSize 默认10

示例：
``` bash
POST /search?pageIndex=1&pageSize=10
```

## RESTful

系统对所有定的模型统一暴露RESTful模式的相关接口。

### 约定
资源以复数形式表示
对1:n n:n 关联资源以复数展示
对 1:1 n:1 以单数展示

关联关系默认使用depth参数控制显示关联模型的深度。depth 默认为 1。 不要设置太大以免增加查询负担。

### 接口

#### GET

##### list
* /assets
* /assets/:id/associates
##### schema
* /assets/schema
##### object
* /assets/:id
* /assets/:id/associate
* /assets/:id/associates/:id
* /assets/:id/associate/:id

#### POST
* /assets

#### PUT
* /assets

#### PATCH
* /assets/:id

#### DELETE
* /assets/:id