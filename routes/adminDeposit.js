const express=require("express");
const { userModel } = require("../models/UserModel");
const DepositModel = require("../models/adminDeposit.Model");
const AdminDeposit=express.Router();



AdminDeposit.post('/', async (req, res) => {
    try {
        const { AccountNo, balance } = req.body;

        // Check if a user with the given AccountNo exists
        const existingUser = await userModel.findOne({ AcNumber: AccountNo });

        if (!existingUser) {
            return res.status(404).send({ msg: "User not available" });
        }

        // Create a new deposit entry for the user
        const deposit = new DepositModel({
            AccountNo,
            balance
           
        });

        // Save the deposit entry
        const deposituser = await deposit.save();
     console.log(balance)

        // Update the totalbalance in userModel
        const newTotalBalance =parseFloat( existingUser.totalbalance) + parseFloat(balance);
            console.log(newTotalBalance)
        if (newTotalBalance >= 0) {
            existingUser.totalbalance = newTotalBalance;
            await existingUser.save();

            return res.status(200).send({ msg: "Amount added successfully", deposituser });
        } else {
            return res.status(400).send({ msg: "Insufficient funds" });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).send({ msg: "Error in network", error: error.message });
    }
});


  

AdminDeposit.get("/:id",async(req,res)=>{
    try {
        if(req.params.id==="asdf1234"){
            const depositList=await DepositModel.find();
            return res.status(200).send(depositList)
        }else{
            return res.status(500).send({msg:"No user Found"})
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg:"Error in network"})
    }
})


module.exports=AdminDeposit;