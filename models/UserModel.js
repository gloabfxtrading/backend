const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: [true, "first_name is required"] },
  last_name: { type: String, required: [true, "last_name is required"] },
  email: { type: String, required: [true, "email is required"] },
  password: { type: String, required: [true, "password is required"] },
  street_add: { type: String, required: [true, "street_add is required"] },
  zip_code: { type: String, required: [true, "zip_code is required"] },
  city: { type: String, required: [true, "city is required"] },
  state: { type: String, required: [true, "state is required"] },
  country: { type: String, required: [true, "country is required"] },
  dob: { type: String, required: [true, "dob is required"] },
  phone: { type: String, required: [true, "phone is required"] },
  account_type: { type: String, required: [true, "acount_type is required"] },
  leverage: { type: String, required: [true, "leverage is required"] },
  AcNumber: { type: String, required: [true, "AcNumber is required"], unique: true },
  totalbalance: { type: Number, default: 0.00 },
  verified: { type: Boolean, default: false },
  verification_status: { type: Boolean, default: false },
  created_at: {
    type: Date,
    default: Date.now, // Set default value to the current timestamp
  },
  neteq: { type: Number, default: 0.00 },
  otp: String,
  otpTimestamp: Date,
})




const userModel = mongoose.model('user', userSchema);

module.exports = { userModel }