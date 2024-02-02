const mongoose=require("mongoose");


const BankSchema=new mongoose.Schema({
    nick_name:{type:String}
      
})


const BankModel=mongoose.model('Bank',BankSchema);
module.exports=BankModel