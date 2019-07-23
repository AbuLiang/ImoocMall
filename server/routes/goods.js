// 路由是通过express框架扩展出来的
// 当前为 二级 路由

var express = require('express'); 
var router = express.Router(); // 通过express框架的对象拿到当前路由，通过路由获取子路由
var mongoose = require('mongoose'); // 需要mongoose对象来操作数据库，
var Goods = require('../models/goods'); // 导入models下的goods数据库模型表

// 连接MongoDB数据库
mongoose.connect('mongodb://root:zhouxin@127.0.0.1:27017/dumall'); // 如果mongoDB 经过认证 mongoose.connect('mongodb://username:password@host:port/database?options...');

mongoose.connection.on("connected", function () { // on 监听数据库是否连接成功
    console.log("MongoDB connected success.");
});

mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected.");
});

// 查询商品列表数据
router.get('/list', function(req, res, next) {
    let page = parseInt(req.param('page')); // 当前页数
    let pageSize = parseInt(req.param('pageSize')); // express封装的获取参数方式 ; Nodejs 原生获取前端参数是通过 url解析  var pageSize = url.parse(req.url).pageSize
    let priceLevel = req.param('priceLevel')
    let sort = req.param('sort'); // 获取前端发送的 排序参数, sort 降序-1/升序1
    let skip = (page-1)*pageSize;
    var priceGt = '', priceLte = ''
    let params = {};
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0': priceGt = 0; priceLte = 500; break;
            case '1': priceGt = 500; priceLte = 1000; break;
            case '2': priceGt = 1000; priceLte = 1500; break;
            case '3': priceGt = 1500; priceLte = 2000; break;
            case '4': priceGt = 2000; priceLte = 4000; break;
            case '5': priceGt = 4000; priceLte = 6000; break;
            case '6': priceGt = 6000; priceLte = 10000; break;
            case '7': priceGt = 10000; priceLte = 20000; break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }
    
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize); // find查找数据  返回一个模型  skip/limit 分页
    goodsModel.sort({'salePrice':sort}); // sort排序, mongodb提供的api
    goodsModel.exec({}, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            res.json({ // 查询成功，将拿到的数据写如 res ，以便前端拿到，格式要统一，方便前端
                status: '0',
                msg: '', // 即使没数据也要传空值，保证前后端交互的数据格式，如果不填 会报 undefined 错
                result: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    })
});

// 加入购物车
router.post('/addCart', function (req, res, next) { // 二级路由 不需要加 /goods , get请求只用来查询，post用来操作
    var userId = '10001', productId = req.body.productId; // 需要先登陆  get 取参直接 req.   post 取参 req.body.
    var User = require('../models/user'); // 引入模型，利用模型调用api

    User.findOne({userId: userId}, function (err, userDoc) { // 查找 userId的用户
        if (err) { // 没有该用户
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            console.log('userDoc:' + userDoc);
            if (userDoc) { // 拿到用户的 文档 userDoc
                let goodsItem = '';
                userDoc.cartList.forEach(function (item) { // 判断userDoc文档内是否已包含 该商品 productId
                    if (item.productId === productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) { // userDoc包含该商品，并且已经Num++，重新 save到数据库
                    userDoc.save(function (err2, doc2) {
                        if (err2) {
                            res.json({
                                status: '1',
                                msg: err2.message
                            });
                        } else {
                            res.json({
                                status: '0',
                                msg: doc2,
                                result: 'suc'
                            });
                        }
                    });
                } else { // userDoc文档没有该商品
                    Goods.findOne({productId:productId}, function (err1, doc) {
                        if (err1) {
                            res.json({
                                status: '1',
                                msg: err1.message
                            });
                        } else {
                            if (doc) {
                                doc.productNum = 1;
                                doc.checked = '1';
                                userDoc.cartList.push(doc);  // 用户文档不存在该商品则需要把商品数据push进userDoc。直接将 添加的商品的文档 doc push到 按userId从数据库查到user表--userDoc 的cartList子文档就行
                                userDoc.save(function (err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: '1',
                                            msg: err2.message
                                        });
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: doc2,
                                            result: 'suc'
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

module.exports = router;
/*
// 查询商品列表数据  分页显示
router.get("/list", function (req, res, next) { // 访问 list
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let priceLevel = req.param("priceLevel");
    let sort = req.param("sort");
    let skip = (page-1)*pageSize;
    let priceGt = '', priceLte = '';
    let params = {};
    if (priceLevel != 'all'){
        switch (priceLevel) {
            case '0':priceGt = 0; priceLte = 100; break;
            case '1':priceGt = 100; priceLte = 500; break;
            case '2':priceGt = 500; priceLte = 1000; break;
            case '3':priceGt = 1000; priceLte = 5000; break;
        }
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize); // find api 返回mongodb的文档
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec(function (err, doc) {
        if (err){
            res.json({
                status:'1',
                msg:err.message
            });
        } else {
            res.json({
                status:'0',
                msg:'',
                result:{
                    countL:doc
                }
            });
        }
    })
});
*/
