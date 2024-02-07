
const mongoose=require("mongoose");


const DepositSchema=new mongoose.Schema({
    AccountNo:{type:String,required:[true,"Account no is required"]},
    balance:{type:Number,required:[true,"balance is required"]},
    created_at: {
        type: Date,
        default: Date.now, // Set default value to the current timestamp
      }, 
})

const DepositModel=mongoose.model("deposit",DepositSchema)

module.exports=DepositModel
