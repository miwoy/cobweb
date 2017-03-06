module.exports = {
    //扫描的文件路径
    paths: ['./'],
    //demoDir:"input/demo/",
    //文档页面输出路径
    outdir: 'doc/',
    //内置主题
    // theme:'ui',
    //自定义主题目录
    //themedir: 'theme-smart-ui/',
    //项目信息配置
    project: {

        //项目名称
        name: '豌豆派',

        //项目描述，可以配置html，会生成到document主页
       description: '<h2>豌豆派-service</h2> <p>................................</p>',

        //版本信息
        version: '1.1.0',

        //地址信息
        url: 'http://www.peapad.com.cn',

        //导航信息
        navs: [{
            name: "首页",
            url: "/index.html"
        }, {
            name: "关于",
            url: "https://github.com/zhh77/smartdoc"
        }]
    },
    //demo页面需要加载的js库
    // demo: {
    //     paths : ['input/code/ui/uicode.js'],
    //     link : ['http://code.jquery.com/jquery-1.11.0.min.js'] 
    // }
    //smartDoc ./
};
