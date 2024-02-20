const express=require("express");
const AdminModel=require('../models/Admin.Model');
const AdminRouteRegister=express.Router();
const bcrypt=require("bcrypt")

AdminRouteRegister.post('/',async(req,res)=>{
    try {
       const{email,password,type}=req.body;

       bcrypt.hash(password, 4, async (err, hash) => {
       const new_admin=new AdminModel({
          email,
          password:hash,
          type
       }) 
       const admin=await new_admin.save();
       return res.status(200).send({msg:"Created admin sucessfully",admin})
    })
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg:"Failed to register"})
    }
})

AdminRouteRegister.get('/:type',async(req,res)=>{
    try {
         
        const admin=await AdminModel.findOne({type:req.params.type})
        return res.status(200).send(admin);
    } catch (error) {
        console.log(error);
    }
})


module.exports=AdminRouteRegister