const Product = require("./product.model")
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Product
    },
    productName:{
        type:String,
        required:true,
    },
    productImage:{
        type:String,
        required:true,
    },
    productPrice:{
        type:Number,
        required:true,
    },
    actualPrice:{
        type:Number,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min:1,
    },
    size: {
        type: String,
        required: true
    },
})

const Cart = mongoose.model('Cart',cartSchema);

module.exports = Cart