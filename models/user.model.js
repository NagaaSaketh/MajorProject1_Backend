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
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    address:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User',userSchema)

module.exports = User
