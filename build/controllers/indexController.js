"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
let indexController = class indexController {
  constructor() {}

  indexAction() {
    return async (ctx, next) => {
      const indexModels = new IndexModel();
      const result = await indexModels.getData();
      ctx.body = await ctx.render('index', {
        data: result
      }); // ctx.body = result;

      console.log('<===controllerInit', ctx.status, '===>');
    };
  }

  testAction() {
    return (ctx, next) => {
      ctx.body = {
        data: "hello test"
      };
    };
  }

};
;
exports.default = indexController;