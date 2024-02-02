const mongoose=require("mongoose");


const updateBalSchema=new mongoose.Schema({
    dealer_id:{type:String},
    order_id:{type:String},
   order_profit:{type:String,required:[true,"profit is required"]}
      
})


const BalModel=mongoose.model('balanceupdate',updateBalSchema);
module.exports=BalModel