// 上面都是导入中间件插件，
//中间 new 了express框架 app , 
// app设置了视图引擎，
//下面设置使用中间件，
// 接着设置路由
// 接着捕获处理 404
// 捕获处理 err 500

var createError = require('http-errors');
var express = require('express'); 
var path = require('path');
var cookieParser = require('cookie-parser'); // cookie 转换
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index'); // 加载路由 按模块分
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods'); // 为商品表模型启用路由  要拿到 routes/goods 的导出 module.exports=router


var app = express(); // 开启一个服务

//app.listen(8080); 监听端口


// view engine setup
app.set('views', path.join(__dirname, 'views')); // 设置访问目录，当router.get里的res.render()渲染时会直接去views找页面index.jade
app.engine('.html', ejs.__express); // 如何查找引擎，不使用 jade页面，改html页面
app.set('view engine', 'html'); // 设置访问的视图引擎 jade引擎，换html页面要改html引擎, 然后需要调整routes/index的路由渲染，改为 html渲染


app.use(logger('dev'));
app.use(express.json()); // express对象代替了旧版的 bodyParser  返回值转换
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 设置静态目录 当前目录下的public


// 处理 cookie

// 在路由前 捕获验证登陆
app.use(function (req, res, next) {
  if (req.cookies.userId) { // cookie 通过 routes/user.js里的 res.cookie保存在用户数据中，缓存在浏览器，后台需要通过前端发来的请求res.cookies拿到前端缓存的cookie
    next(); // 若果已经登陆，则继续向下执行
  } else {
    if (req.path === '/users/login' || req.path === '/users/logout' || req.path === '/goods/list') { // 通过源url判断未登录的用户的操作是否合法，忽略白名单里的操作
      next();
    } else {
      res.json({
        status: '1',
        msg: '当前未登陆',
        result: '' // 即使没数据也要传空值，保证前后端交互的数据格式，如果不填 会报 undefined 错
      })
    }
  }
});

// 添加路由到应用上
app.use('/', indexRouter); // 启用加载的路由，访问'/'时 加载 indexRouter路由 ，即访问 index.js 下的数据
app.use('/users', usersRouter); // 一级路由，在views/users.js里通过 router.get可以定义二级路由
app.use('/goods', goodsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) { // 对全局404 拦截
  next(createError(404)); // 当next找不到页面时，就返回错误对象
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); // 报错 渲染error页面
});

module.exports = app;
