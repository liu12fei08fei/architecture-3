import _ from 'lodash';
import path from 'path';
let config = {
    "routes": path.join(__dirname,'..','controllers/*.js'),//所有controllers
    "models": path.join(__dirname,'..', 'services/*.js'),//所有models
    "viewDir": path.join(__dirname, '..', 'views'),
    "staticDir": path.join(__dirname, '..', 'assets'),
    "env": process.env.NODE_ENV //"development" 、"production"
};
if (false) {
    console.log(123);
}
//开发环境下
if (process.env.NODE_ENV == "development") {
    const localConfig = {
        port: 2018
    };
    config = _.extend(config, localConfig);
    // console.log(config);//{ env: 'development', port: 2018 }
}
//上线环境下
if (process.env.NODE_ENV == "production") {
    const proConfig = {
        port: 2018
    };
    config = _.extend(config, proConfig);
}
export default config;