let http = require('http')
let util = require('util')

http.get('http://www.imooc.com/search/hotwords', function (res) { // 调用第三方服务时 一般需要凭证 cookie
    let data = ''
    res.on('data', function (chunk) { // 监听
        data += chunk
    })

    res.on('end', function () {
        let result = JSON.parse(data)

        console.log('result' + util.inspect(result))
    })
})