const mongoose = require('mongoose');

const DemouserSchema = new mongoose.Schema({
  first_name: { type: String, required: [true, "first_name is required"] },
  last_name: { type: String, required: [true, "last_name is required"] },
  
 
  
  totalbalance: { type: Number, default: 0.00 },
  
  created_at: {
    type: Date,
    default: Date.now, // Set default value to the current timestamp
  },
  neteq: { type: Number, default: 0.00 },
  bonus:{type:Number,default:0.00},
  otp: String,
  otpTimestamp: Date,
})




const DemouserModel = mongoose.model('user', DemouserSchema);

module.exports = { DemouserModel }