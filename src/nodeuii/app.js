import Koa from "koa";
import config from "./config";
import router from 'koa-simple-router';
import render from "koa-swig";
import co from 'co';
import serve from 'koa-static';
// import controllerInit from './controllers/controllerInit';
import log4js from 'log4js';//非常优秀的库，即前端的专卖店，牌子
import errorHandler from "./middlewares/errorHandler";
const app = new Koa();
// 生成错误日志，方便排错
log4js.configure({
    appenders: { cheese: { type: 'file', filename: './log/yd.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');
// 错误处理，需要使用await next();的洋葱特性来进行管理
errorHandler.error(app, logger);
// aop系列
const { asClass, asValue, createContainer, Lifetime} = require('awilix')
const { loadControllers, scopePerRequest } = require('awilix-koa')
// 创建IOC容器
const container = createContainer();
// 添加中间件，将其传递给您的Awilix容器，这将在上下文上附加一个作用域的容器
// 每一次的请求都是一个new model实例
app.use(scopePerRequest(container))
// 自动运行所有路由：将所有控制器装入路由文件夹，相对于当前工作目录，这是一种glob模式
app.use(loadControllers(config.routes, { cwd: __dirname }));
// 把models和controller结合到一起
// 装载所有的models(即services)，并将所有的services代码注入到controllers
container.loadModules([config.models], {
    // we want `TodosService` to be registered as `todosService`.
    // 对controller进行驼峰转换
    formatName: 'camelCase',
    registrationOptions: {
        // 指定生命周期
        lifetime: Lifetime.SCOPED
    }
})
// 模板
app.context.render = co.wrap(render({
    root: config.viewDir,
    autoescape: true,
    cache: 'memory', // disable, set to false 
    ext: 'html',
    varControls: ["[[", "]]"],
    writeBody: false
}));
// 初始化模板
app.use(serve(config.staticDir));
// 绑定指定端口号，项目过多的时候，可以对端口好进行动态判断
app.listen(config.port, () => {
    console.log(`Server is running at http://0.0.0.0:${config.port}`);
});
module.exports = app;