/* 插件代理实现跨域 */

module.exports = {
    // baseUrl: '/',
    devServer: {
        port: 8080,
        hotOnly: true,
        proxy: { // 代理插件负责转发，将源请求转发到目的端口，避免跨域，代替Ngnix功能
            '/goods': {
                target: 'http://localhost:3000' // target host
                // secure: false,  // 如果是https接口，需要配置这个参数
                // ws: true, // proxy websockets
                // changeOrigin: true // 是否跨域 needed for virtual hosted sites
                // pathRewrite: {
                //     '^/goods': '' // rewrite path
                // }
            },
            '/goods/*': {
                target: 'http://localhost:3000'
            },
            '/users/*': { // * 只代理到第2级路由  **代理/users 下所有路由
                target: 'http://localhost:3000' // 代理，将 localhost:8080/user/login  转向  localhost:3000/user/login
            }
        }
    }
}

/*
// 开发请求  本地 mock模拟数据的配置方法
// vue2.0 在 build/dev-server.js中配置，3.0 删除了 build和config 文件夹，需要在 vue.config.js 中配置  
var express = require('express') // 引入express框架 内置了基于nodejs的express，所以能够通过8080端口访问静态资源（部署后就是访问后台资源）
var app = express() // 实例化对象

var router = express.Router() // 引入路由
var appData = require('./public/mock/goods.json') // 获取存放数据的json，注意路径

app.use(router) // 一级路由 使用插件，启用路由 ，就是当前端通过 8080访问 /goods时 利用 启用的 router 输出 appData（本地的静态数据，部署时就是后端的 数据）

module.exports = { // vue-cli 规定该文件需要导出一个包含了选项的对象
    devServer: {
        before: function (app) {
                app.get('/goods', function (req, res) { // 设置前端请求的地址 为 /goods  二级路由 要加上app.use设置的一级路由
                res.json(appData)
            })
        }
    }
}
*/

/* 
const express = require('express') // 引入express框架 内置了基于nodejs的express，所以能够通过8080端口访问静态资源（部署后就是访问后台资源）
const app = express() // 实例化对象

var appData = require('./public/mock/goods.json')

var apiRoutes = express.Router()
app.use('/api', apiRoutes)

module.exports = {
    publicPath: '/', // 部署应用包时的基本 url 
    outputDir: 'dist', // 运行vue-cli-service build 时生成的生产环境构建文件的目录
    devServer: {
        port: 8080,
        open: false, // 启动完成后自动打开浏览器
        before: function (app) {
            app.get('/api/goods', function (req, res) {
                res.json({ code: 0, data: appData })
            })
        }
    }
}
*/
