const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number },
    address: { type: String },
    passwordResetToken: { type: String, default: null },
    passwordResetTokenExpiry: { type: Date, default: null },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    isLoggedIn: { type: Boolean, default: null }
})

const UserData=mongoose.model('Users',userSchema)
module.exports={UserData}