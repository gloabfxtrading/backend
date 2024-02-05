const mongoose=require("mongoose");


const BankSchema=new mongoose.Schema({
    IDNumber:{type:String,required:[true,"accountId is required"]},
    nick_name:{type:String,required:[true,"nick name is required"]},
    full_name:{type:String,required:[true,"full_name is required"]},
    bank_name:{type:String,required:[true,"bank name is required"]},
    ifsc_code:{type:String,required:[true,"ifsc code is required"]},
    account_number:{type:Number,required:[true,"account_number is required"]},
    branch_name:{type:String,required:[true,"branch name is required"]},
    city:{type:String,required:[true,"city is required"]},
    country:{type:String,required:[true,"country is required"]},
    currency:{type:String,required:[true,"currency is required"]},
      
})


const BankModel=mongoose.model('Bank',BankSchema);
module.exports=BankModel