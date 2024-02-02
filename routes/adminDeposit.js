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

        // Check if a deposit entry already exists for the given AccountNo
        const existingDeposit = await DepositModel.findOne({ AccountNo });

        if (existingDeposit) {
            // If the deposit entry exists, update the balance
            existingDeposit.balance += balance;

            // Save the updated deposit entry
            const updatedDeposit = await existingDeposit.save();

            return res.status(200).send({ msg: "Amount added successfully", deposituser: updatedDeposit });
        } else {
            // If the deposit entry doesn't exist, create a new one
            const deposit = new DepositModel({
                AccountNo,
                balance
            });

            let deposituser = await deposit.save();
            return res.status(200).send({ msg: "Amount added successfully", deposituser });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).send({ msg: "Error in network", error: error.message });
    }
});





AdminDeposit.get("/:id", async (req, res) => {
    try {
        const accountId = req.params.id;

        // Aggregate deposits with the same account number
        const depositAggregation = await DepositModel.aggregate([
            {
                $match: { AccountNo: accountId }
            },
            {
                $group: {
                    _id: "$AccountNo",
                    totalBalance: { $sum: "$balance" }, // Assuming your deposit schema has a "balance" field
                   
                }
            }
        ]);

        // Check if there are aggregated results
        if (depositAggregation.length > 0) {
            const { totalBalance } = depositAggregation[0];
            const AccountNo = depositAggregation[0]._id || accountId; // Use accou
           

            return res.status(200).send({
                AccountNo,
                totalBalance,
                
            });
        } else {
            return res.status(404).send({ msg: "No deposits found for the provided account number" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Error in network" });
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