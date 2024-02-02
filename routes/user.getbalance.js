const express=require("express");
const ClosedDealModel = require("../models/ClosedDeal");
const DepositModel = require("../models/adminDeposit.Model");


const UserGetRoute=express.Router();


UserGetRoute.get("/:id", async (req, res) => {
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
})
UserGetRoute.put("/addsub/:id", async (req, res) => {
    try {
        const accountId = req.params.id;
        const profitToAdd = req.body.profit; // Assuming profit is sent in the request body

        // Find the deposit record for the specified account
        const existingDeposit = await DepositModel.findOne({ AccountNo: accountId });

        if (existingDeposit) {
            // Update the balance by adding the profit
            if(existingDeposit===0){
                existingDeposit = await DepositModel.findOne({ AccountNo: accountId });
            }
            existingDeposit.balance -= profitToAdd;

            // Save the updated deposit record
            const updatedDeposit = await existingDeposit.save();

            return res.status(200).send({
                AccountNo: updatedDeposit.AccountNo,
                totalBalance: updatedDeposit.balance,
            });
        } else {
            return res.status(404).send({ msg: "No deposits found for the provided account number" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Error in network" });
    }
});


// UserGetRoute.put("/:id/:order_id", async (req, res) => {
//     try {
//         const {id,order_id} = req.params;

//         // Identify the closed deal and retrieve order_profit (replace 'ClosedDealModel' with your actual model for closed deals)
//         const closedDeal = await ClosedDealModel.find({ dealer_id: id,order_id:order_id});

//         if (!closedDeal) {
//             return res.status(404).send({ msg: "No closed deal found for the provided account number" });
//         }

//         const orderProfit = closedDeal.order_profit;

//         // Retrieve the deposit records
//         const deposits = await DepositModel.find({ AccountNo: id });

//         // Check if there are deposits
//         if (deposits.length > 0) {
//             // Calculate the new balance for each deposit
//             const updatedDeposits = deposits.map(deposit => {
//                 const updatedBalance = deposit.balance - orderProfit;
//                 return { ...deposit.toObject(), balance: updatedBalance };
//             });

//             // Update the balance field in the deposit records
//             await Promise.all(updatedDeposits.map(updatedDeposit =>
//                 DepositModel.updateOne({ _id: updatedDeposit._id }, { $set: { balance: updatedDeposit.balance } })
//             ));

//             // Calculate the new totalBalance and totalBonus
//             const totalBalance = updatedDeposits.reduce((sum, deposit) => sum + deposit.balance, 0);
            

//             return res.status(200).send({
//                 AccountNo: accountId,
//                 totalBalance,
//                 totalBonus,
//                 totalPriceBonus: totalBalance + totalBonus
//             });
//         } else {
//             return res.status(404).send({ msg: "No deposits found for the provided account number" });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ msg: "Error in network" });
//     }
// });



module.exports=UserGetRoute;