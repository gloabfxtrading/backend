
const mongoose = require("mongoose");


const UserDepositSchema = new mongoose.Schema({
    AcNumber:{ type: String, required: [true, "AcNumber is required"] },
    code: { type: String, required: [true, "Account no is required"] },
    amount: { type: Number, required: [true, "balance is required"] },
    Image: { type: String, required: [true, "image is required"] },
    type_at: {
        type: String, default: "pending"
    },
    created_at: {
        type: Date,
        default: Date.now, // Set default value to the current timestamp
      }, 
})

const UserDepositModel = mongoose.model("userdeposit", UserDepositSchema)

module.exports = UserDepositModel