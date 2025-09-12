const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    emailID: {
      type: String,
      required: true,
      unique:true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    password:{
      type:String,
      required:true,
    },
    address: [
      {
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
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User',userSchema)

module.exports = User
