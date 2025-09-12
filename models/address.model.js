const mongoose = require("mongoose");
const User = require("./user.model");

const addressSchema = new mongoose.Schema(
  {
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true,
    },
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
  },
  { timestamps: true }
);


const Address = mongoose.model('Address',addressSchema);

module.exports = Address