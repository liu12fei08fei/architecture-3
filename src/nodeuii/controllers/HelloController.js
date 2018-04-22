// before是拦截器
import { route, GET, POST, before } from 'awilix-koa';

// 装饰器，注册路由
@route('/hello')
export default class HelloController {
    constructor({ testService }) {
        this.testService = testService;
    }
    // 模板引入，默认index
    @GET()
    async getUser(ctx) {
        const result = this.testService.find();
        ctx.body = await ctx.render('index', { data: result });
    }
}

// /hello/getuser