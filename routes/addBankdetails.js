const express=require("express");
const BankModel = require("../models/BankDetails");
const { userModel } = require("../models/UserModel");

const BankRoute=express.Router();


BankRoute.post('/:id',async(req,res)=>{
    try {
        const {IDNumber,nick_name,full_name,bank_name,ifsc_code,account_number,branch_name,city,country,currency}=req.body;
        const accountId=req.params.id;
        const User= await userModel.findOne({AcNumber:accountId});
        const new_bank=new BankModel({
            IDNumber:User.AcNumber,
            nick_name,
            full_name,
            bank_name,
            ifsc_code,
            account_number,
            branch_name,
            city,
            country,
            currency
        })
        const bank=await new_bank.save();
        return res.status(200).send({msg:"Added Bank Successfully",bank})
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg:"Unable to add Bank"})
    }
})

BankRoute.get("/:id",async(req,res)=>{
    try {
        const accountId=req.params.id
        const bank=await BankModel.find({IDNumber:accountId})
        return res.status(200).send(bank);
    } catch (error) {
        return res.status(500).send({msg:"unable to fetch bank"})
    }
})

module.exports=BankRoute 