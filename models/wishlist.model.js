const mongoose = require("mongoose");
const Product = require("./product.model");
const User = require("./user.model");

const wishlistSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
    },
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
    size:{
        type:String,
        required:true
    },
},{timestamps:true})

const Wishlist = mongoose.model('Wishlist',wishlistSchema);

module.exports = Wishlist;