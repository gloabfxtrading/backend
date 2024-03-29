const mongoose = require("mongoose");


const dealDemoSchema = new mongoose.Schema({
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
  price: { type: Number, required: [true, "price is required"] },
  pip: { type: Number, required: [true, "pip is required"] },
  changecurr:{ type: Number, required: [true, "chnage is required"] },

})


const DealModelDemo = mongoose.model('dealdemo', dealDemoSchema);
module.exports = DealModelDemo