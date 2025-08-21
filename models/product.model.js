const mongoose = require("mongoose");
const Category = require("./category.model");

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
    },
    productType:{
        type:String,
        enum:["T-Shirts","Shirts","Hoodies","Pants","Oversized T-shirts"],
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
    productRating:{
        type:Number,
        required:true,
        min:0,
        max:5,
    },
    productDescription:{
        type:String,
        required:true,
    },
    productInfo:[{
        type:String,
        required:true,
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Category,
        required: true,
    }
})

const Product = mongoose.model("Product",productSchema);

module.exports = Product