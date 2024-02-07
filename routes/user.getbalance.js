const express = require("express");
const ClosedDealModel = require("../models/ClosedDeal");
const DepositModel = require("../models/adminDeposit.Model");
const { userModel } = require("../models/UserModel");


const UserGetRoute = express.Router();


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
        const profitToSubtract = req.body.profit; // Assuming profit is sent in the request body

        // Find the user record based on the account number
        const user = await userModel.findOne({ AcNumber: accountId });

        if (user) {
            console.log(user.totalbalance)
            // Subtract the profit from the totalbalance in userModel
            user.totalbalance -= profitToSubtract;
            
            // Save the updated user record

            console.log('Updated Total Balance:', user.totalbalance);
            await user.save();

            // Create a new deposit entry
            const deposit = new DepositModel({
                AccountNo: accountId,
                balance: -profitToSubtract, // Negative because it's a subtraction
                type:"deal",
                timestamp: new Date(), // You may adjust this based on your timestamp logic
            });

            // Save the new deposit entry
            const newDeposit = await deposit.save();

            return res.status(200).send({
                AccountNo: newDeposit.AccountNo,
                totalBalance: user.totalbalance, // Updated totalbalance from userModel
            });
        } else {
            return res.status(404).send({ msg: "No user found for the provided account number" });
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



module.exports = UserGetRoute;