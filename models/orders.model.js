const mongoose = require("mongoose");
const User = require("./user.model");
const Product = require("./product.model");

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    items: [
      {
        productId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:Product,
        },
        productName: {
          type: String,
          required: true,
        },
        productImage: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price:{
          type:Number,
          required:true,
        }
      },
    ],
    address:[{
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          required: true,
        },
    }],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered","Reattempt","Cancelled"],
      default: 'Shipped',
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Completed",
    },
    paymentMethod:{
      type:String,
      enum:["UPI","Debit Card","Credit Card","COD"],
      required:true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
