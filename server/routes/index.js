var express = require('express');
var router = express.Router();

/* GET home page. */
// router 类似 controller功能
router.get('/', function(req, res, next) { // 拦截 '/' 的访问
  // 返回要 渲染的页面  app.set已经设置了要查找的页面路径，可以直接找到index.jade页面， 传递的参数title：Express通过模板语法绑定到页面index.jade上
  res.render('index', {title: 'Express'});
});

module.exports = router;
