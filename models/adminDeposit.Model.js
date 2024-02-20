
const mongoose=require("mongoose");


const DepositSchema=new mongoose.Schema({
    AccountNo:{type:String,required:[true,"Account no is required"]},
    balance:{type:Number,required:[true,"balance is required"]},
    bonus:{type:Number,default:0},
   
    created_at: {
        type: Date,
        default: Date.now, // Set default value to the current timestamp
      }, 
      type_at:{
            type:String,required:true
      }
})

const DepositModel=mongoose.model("deposit",DepositSchema)

module.exports=DepositModel
