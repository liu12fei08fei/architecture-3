"use strict";

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _koaSimpleRouter = require("koa-simple-router");

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

var _koaSwig = require("koa-swig");

var _koaSwig2 = _interopRequireDefault(_koaSwig);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _log4js = require("log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _errorHandler = require("./middlewares/errorHandler");

var _errorHandler2 = _interopRequireDefault(_errorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import controllerInit from './controllers/controllerInit';
//非常优秀的库，即前端的专卖店，牌子
const app = new _koa2.default(); // 生成错误日志，方便排错

_log4js2.default.configure({
  appenders: {
    cheese: {
      type: 'file',
      filename: './log/yd.log'
    }
  },
  categories: {
    default: {
      appenders: ['cheese'],
      level: 'error'
    }
  }
});

const logger = _log4js2.default.getLogger('cheese'); // 错误处理，需要使用await next();的洋葱特性来进行管理


_errorHandler2.default.error(app, logger); // aop系列


const {
  asClass,
  asValue,
  createContainer,
  Lifetime
} = require('awilix');

const {
  loadControllers,
  scopePerRequest
} = require('awilix-koa'); // 创建IOC容器


const container = createContainer(); // 添加中间件，将其传递给您的Awilix容器，这将在上下文上附加一个作用域的容器
// 每一次的请求都是一个new model实例

app.use(scopePerRequest(container)); // 自动运行所有路由：将所有控制器装入路由文件夹，相对于当前工作目录，这是一种glob模式

app.use(loadControllers(_config2.default.routes, {
  cwd: __dirname
})); // 把models和controller结合到一起
// 装载所有的models(即services)，并将所有的services代码注入到controllers

container.loadModules([_config2.default.models], {
  // we want `TodosService` to be registered as `todosService`.
  // 对controller进行驼峰转换
  formatName: 'camelCase',
  registrationOptions: {
    // 指定生命周期
    lifetime: Lifetime.SCOPED
  }
}); // 模板

app.context.render = _co2.default.wrap((0, _koaSwig2.default)({
  root: _config2.default.viewDir,
  autoescape: true,
  cache: 'memory',
  // disable, set to false 
  ext: 'html',
  varControls: ["[[", "]]"],
  writeBody: false
})); // 初始化模板

app.use((0, _koaStatic2.default)(_config2.default.staticDir)); // 绑定指定端口号，项目过多的时候，可以对端口好进行动态判断

app.listen(_config2.default.port, () => {
  console.log(`Server is running at http://0.0.0.0:${_config2.default.port}`);
});
module.exports = app;