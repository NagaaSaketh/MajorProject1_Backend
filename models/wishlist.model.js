const mongoose = require("mongoose");
const Product = require("./product.model");

const wishlistSchema = new mongoose.Schema({
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
        type:Number
    }
},{timestamps:true})

const Wishlist = mongoose.model('Wishlist',wishlistSchema);

module.exports = Wishlist;