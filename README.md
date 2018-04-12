# 简介

cobweb是一个小型轻量级的基于koa2框架的web脚手架。脚手架中配置了babel编译命令，可直接使用es6与es7语法开发项目，使用npm run build编译代码至build/目录中。cobweb使用测试框架mocha,断言库should,测试报告istanbul的测试体系。cobweb脚手架支持静态资源访问/src,ejs模板输出，与json数据接口三种形式的response


----
###### 例如：
> http://127.0.0.1:3000 默认输出模板  
> http://127.0.0.1:3000/api/test/getTests 默认输出json  
> http://127.0.0.1:3000/css/index.css 默认输出文件


## 开始

1. 安装依赖
<pre>npm install --registry=https://registry.npm.taobao.org</pre>
2. 修改lib/config/dev_confnig.js 中mysql配置，改成自己的mysql
<pre>
   mysql: {
        host: "127.0.0.1",
        port: "3306",
        username: "root",
        password: "123456",
        database: "cobweb",
        dialect: "mysql",
        timezone: "+08:00",
        benchmark: false,
        logging: console.log,
        pool: {
            maxConnections: 20,
            minConnections: 0,
            maxIdleTime: 10000
        }
    } 
</pre>
3. 开始运行
<pre>
    npm run dev
</pre>
4. 测试代码,代码测试后会生成相应测试报告,mochawesome-report是测试报告，coverage是测试覆盖率报告
<pre>
    npm test
</pre>
5. eslint代码检测
<pre>
    npm run eslint
</pre>
6. 编译代码，编译后的代码在build/目录下用来做线上部署
<pre>
    npm run build
</pre>
7. 线上运行
<pre>
    cd build/
    pm2 start ./bin/www --name cobweb
</pre>

## 目录结构介绍

#### bin 脚本

自动化脚本，启动脚本

        build.sh    构建脚本
        run         runkoa方式启动脚本
        www         启动项


#### application 应用程序层（业务逻辑层）

与业务相关的逻辑代码或与数据交互的核心代码。


#### lib 基础设施层(infrastructure)

服务于项目内所有部分，存放一些公有工具函数，配置文件，以及第三方服务封装

    common          公共工具
    config          配置文件
    global          全局属性配置
    middleware      中间件
    scripts         js脚本
    service         第三方服务    

#### models 模型层
基于sequelize的数据模型，以及sequellize初始化配置

#### routes 路由层

        routes/api      以JSON形式返回数据的webapi
        routes/pages    ejs模板返回html


#### src 静态资源层
项目中公共静态资源，包含前端使用的js,css,image等
#### test 测试层

#### 根目录文件介绍
    .babelrc            babelrc插件配置
    .eslintignore       eslint排除文件
    .eslintrc.yml       eslintrc配置文件
    .gitignore          git排除文件
    app.js              应用程序入口
    package.json        项目配置

----


