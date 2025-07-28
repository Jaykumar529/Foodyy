const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  email: String,
  otp: String,
  expiresAt: Date,
});

const OTP = mongoose.model("OTPS", otpSchema);
module.exports = OTP;
