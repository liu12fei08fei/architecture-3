// class indexController {
//     constructor(){}
//     indexAction(){
//         return async(ctx, next) => {
//             const indexModels = new IndexModel();
//             const result = await indexModels.getData();
//             ctx.body = await ctx.render('index', { data: result});
//             // ctx.body = result;
//             console.log('<===controllerInit', ctx.status, '===>');
//         }
//     }
//     testAction(){
//         return (ctx,next)=>{
//             ctx.body = {
//                 data:"hello test"
//             };
//         };
//     }
// };

// export default indexController;
import { route, GET, POST, before } from 'awilix-koa';
@route('/users')
export default class UserController{
    constructor({ userService }) {
        this.userService = userService;
    }
    // 模板引入，默认index
    @route('/:id')
    @GET()
    async getUser(ctx,next) {
        const result = await this.userService.getData(ctx.params.id);
        ctx.body = await ctx.render('index', { data: result });
    }
}