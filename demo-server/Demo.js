let user = require('./User')
let http = require('http')
let url = require('url')
let util = require('util')

console.log(`userName:${user.userName}`)

console.log(`${user.sayHello()}, I'm ${user.userName}`)

let server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')

    console.log('url:' + req.url)
    console.log('parse:' + url.parse(req.url)) // [object]
    console.log('inspect:' + util.inspect(url.parse(req.url))) // 将对象转换成字符串

    res.end(util.inspect(url.parse('http://127.0.0.1:3000/index.html?a=123')))
})

server.listen(3000, '127.0.0.1', () => {
    console.log('服务器已经运行，请从 http://127.0.0.1:3000/ 访问')
})
