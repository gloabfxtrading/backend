
const mongoose=require("mongoose");


const AdminSchema=new mongoose.Schema({
    mobile:{type:String,required:[true,"mobile is required"]},
    email:{type:String,required:[true,"email is required"]},
    password:{type:String,required:[true,"password is required"]},
    type:{type:String,default:"Admin",required:[true,"type is required"]},
})

const AdminModel=mongoose.model("admin",AdminSchema)

module.exports=AdminModel