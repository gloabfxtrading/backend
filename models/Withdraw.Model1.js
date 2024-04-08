const mongoose = require("mongoose");


const WithdrawSchema1 = new mongoose.Schema({
    IDNumber: { type: String, required: [true, "accountId is required"] },
    Alloption:{ type: String, required: [true, "Alloption is required"]  },
    AccountId:{ type: String, },
    
    withdraw_id: { type: String, required: [true, "id is required"] },
    withdraw_money: { type: Number, required: [true, "withdraw money is required"] },
    remarks: { type: String, required: [true, "remarks is required"] },
    status: { type: String, default: "pending" },
    created_at: {
        type: Date,
        default: Date.now, // Set default value to the current timestamp
    },

})

const WithdrawModel1 = mongoose.model("withdrawamount1", WithdrawSchema1)
module.exports = WithdrawModel1;