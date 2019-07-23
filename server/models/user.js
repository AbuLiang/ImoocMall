// models下的模板类似 django 中的 model ，与数据库统一，用来获取数据
// 只不过express 里还需要 module.exports 导出，以便 routes里的路由调用
var mongoose = require('mongoose'); // 导入mongoose

var userSchema = new mongoose.Schema({ // 创建userSchema模型
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [
        {
            "productId": String,
            "productName": String,
            "salePrice": String,
            "productImage": String,
            "checked": String,
            "productNum": Number
        }
    ],
    "addressList": [
        {
            "addressId": String,
            "userName": String,
            "streetName": String,
            "postCode": Number,
            "tel": Number,
            "isDefault": Boolean
        }
    ]
});

module.exports = mongoose.model("User", userSchema,'users');