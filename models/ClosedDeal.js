const mongoose = require("mongoose");


const ClosedSchema = new mongoose.Schema({
    dealer_id: { type: String, required: [true, "order_id is required"] },
    order_id: { type: String, required: [true, "order_id is required"] },
    order_type: { type: String, required: [true, "order_type is required"] },
    title: { type: String, required: [true, "title is required"] },
    lotsize: { type: String, required: [true, "lotsize is required"] },
    created_at: {
        type: Date,
        default: Date.now, // Set default value to the current timestamp
    },
    bidorask: { type: String, required: [true, "bidorask is required"] },
    takeprofit: { type: String, default: null },
    stoploss: { type: String, default: null },
    close_rate: { type: String, required: [true, "close rate is required"] },
    order_profit: { type: String, required: [true, "order_profit is required"] },
    manual_auto: { type: String, required: [true, "manual auto is required"] , default: "Auto Close" },
    closed_at: {
        type: Date,
        default: Date.now, // Set default value to the current timestamp
      }, 
})

const ClosedDealModel=mongoose.model('closeddeal',ClosedSchema)

module.exports=ClosedDealModel





