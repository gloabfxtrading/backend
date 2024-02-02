
const mongoose=require("mongoose");


const DepositSchema=new mongoose.Schema({
    AccountNo:{type:String,required:[true,"Account no is required"]},
    balance:{type:Number,required:[true,"balance is required"]},
    bonus:{type:Number,default:0},
})

const DepositModel=mongoose.model("deposit",DepositSchema)

module.exports=DepositModel
