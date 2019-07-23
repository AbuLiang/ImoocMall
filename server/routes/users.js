var express = require('express');
var router = express.Router();
require('./../util/util');
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/info', function(req, res, next) { // 二级路由
  res.send('user’ info');
});

// 登录接口
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/', // 将cookie放在服务器根目录下
          maxAge: 1000*60*60
        });
        res.cookie('userName', doc.userName, {
          path: '/', // 将cookie放在服务器根目录下
          maxAge: 1000*60*60
        });
        // req.session.user = doc; // 通过session拿到用户信息，防止cookie伪造, 需要装插件 express-session
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName // 返回 userName 以显示 nickName
          }
        });
      }
    }
  });
});

// 登出接口
router.post('/logout', function (req, res, next) {
  res.cookie('userId', '', { // 清空cookie
    path: '/',
    maxAge: -1
  });
  res.cookie('userName', '', { // 清空cookie
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: '' // 即使没数据也要传空值，保证前后端交互的数据格式，如果不填 会报 undefined 错
  });
});

// 登陆状态校验接口，防止刷新丢掉登陆状态
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: {
        userId: req.cookies.userId || '',
        userName: req.cookies.userName || ''
      }
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

// 查询当前用户购物车数据
router.get('/cartList', function (req, res, next) {
  // 上面做了用户登录拦截，所以这里直接拿 就可以
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '1',
          msg: '',
          result: doc.cartList
        });
      }
    }
  });
});

// 购物车数据删除
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId, productId = req.body.productId;
  User.update({ // 两种删除数据，1.find()拿到所有数据cartList遍历productId后修改 2.mongodb提供了update api
    'userId': userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        });
      }
    }
  });
});

// 购物车商品数量修改
router.post('/cartEdit', function (req, res, next) {
  var userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  User.update({'userId': userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum, // 更新的字段前加 $
    'cartList.$.checked': checked
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      });
    }
  });
});

// 购物车商品全选状态修改
router.post('/editCheckAll', function (req, res, next) {
  var userId = req.cookies.userId,
      checkAllFlag = req.body.checkAllFlag ? '1' : '0';
  User.findOne({'userId': userId}, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAllFlag;
        });
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        });
      }
    }
  });
    
});

// 查询用户地址接口
router.get('/addressList', function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.addressList
        });
      }
    }
  });
});

// 设置默认地址
  router.post('/setDefault', function (req, res, next) {
    var userId = req.cookies.userId,
        addressId = req.body.addressId;
    if (!addressId) {
      res.json({
        status: '1003', // 逻辑层报错
        msg: 'addressId is null',
        result: ''
      });
    } else {
      User.findOne({userId: userId}, function (err, doc) {
        if (err) {
          res.json({
            status: '1', // 系统层报错 mongodb
            msg: err.message,
            result: ''
          });
        } else {
          var addressList = doc.addressList;
          addressList.forEach((item) => { // 默认地址只能有一个，不是选中的都改成false
            if (item.addressId === addressId) {
              item.isDefault = true;
            } else {
              item.isDefault = false;
            }
          });
          doc.save(function (err1, doc1) {
            if  (err) {
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              });
            } else {
              res.json({
                status: '0',
                msg: 'set suc',
                result: ''
              });
            }
          });
        }
      });
    }
  });

// 删除地址的接口
router.post('/delAddress', function (req, res, next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
  User.update({userId: userId}, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
       res.json({
         status: '1',
         msg: err.message,
         result: '',
       });
    } else {
      res.json({
        status: '0',
        msg: 'del suc',
        result: ''
      });
    }
  });
});

// 生成订单
router.post('/payMent', function (req, res, next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var address = '', goodsList = [];
      // 需要保存到数据库的数据
      // 获取当前用户地址信息
      doc.addressList.forEach((item) => {
        if (addressId === item.addressId) {
          address = item;
        }
      });
      // 获取用户信息
      doc.cartList.filter((item) => {
        if (item.checked === '1') {
          goodsList.push(item);
        }
      });

      var platform = '622';
      var r1 = Math.floor(Math.random()*10);
      var r2 = Math.floor(Math.random()*10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform + r1 + sysDate + r2;

      // 生成订单信息
      var order = {
        orderId: orderId, // 订单号
        orderTotal: orderTotal, // 总价格从check页面传
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate // 创建日期
      };

      doc.orderList.push(order);
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });
    }
  });
});

// 订单成功后，根据订单Id查询订单信息
router.get('/orderDetail', function (req, res, next) {
  var userId = req.cookies.userId, orderId = req.param('orderId'); // Get req.param()  Post req.body.
  User.findOne({userId: userId}, function (err, userInfo) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var orderList = userInfo.orderList;
      if (orderList.length > 0) {
        var orderTotal = 0;
        orderList.forEach((item) => {
          if (item.orderId === orderId) {
            orderTotal = item.orderTotal;
          }
        });
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId:  orderId,
              orderTotal: orderTotal
            }
          });
        } else {
          res.json({
            status: '12002',
            msg: '未查到改订单',
            result: ''
          });
        }
        
      } else {
        res.json({
          status: '12001',
          msg: '尚未创建订单',
          result: ''
        });
      }
    }
  });
});

// 查询购物车数量
router.get('/getCartCount', function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({userId: userId}, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        var cartList = doc.cartList;
        var cartCount = 0;
        cartList.map(function (item) {
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        });
      }
    });
  } else {
    res.json({
      status:"0",
      msg:"当前用户不存在"
    });
  }
});

module.exports = router;
