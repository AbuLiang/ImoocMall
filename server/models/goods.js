// models下的模板类似 django 中的 model ，与数据库统一，用来获取数据
// 只不过express 里还需要 module.exports 导出，以便 routes里的路由调用
var mongoose = require('mongoose'); //会自动去node_modules里查找
var Schema = mongoose.Schema; // 定义表模型

var productSchema  = new Schema({ // 为表模型定义结构
    'productId': {type: String},
    'productName': String,
    'salePrice': Number,
    'productImage': String,
    'checked': String,
    'productNum': Number
});

module.exports = mongoose.model('Good',productSchema,'goods'); // 导出商品的表模型，外层基于该模型调用API方法 ，routes里需要设置路由，并在app.js里启用路由

// var mongoose = require('/mongoose');
// var Schema = mongoose.Schema;

// var productSchema = new Schema({
//     "productId":{type:String},
//     "productName":String,
//     "salePrice":Number,
//     "checked":String,
//     "productNum":Number,
//     "productImage":String
// });

// module.exports = mongoose.model('Good', productSchema);