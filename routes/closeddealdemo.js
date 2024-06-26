const express = require("express");
const ClosedDealRouteDemo = express.Router();
const ClosedDealModelDemo = require("../models/Closeddeal.Demo.Model")
const DealModelDemo = require("../models/dealDemo");
const DepositModel = require("../models/adminDeposit.Model");
const { DemouserModel } = require("../models/demo.UserModel")
const authentication = require("../middlewares/authenication")
const axios=require("axios");



const dealClosingLocks = {};
ClosedDealRouteDemo.post('/:id/:order_id', async (req, res) => {
    // Assuming userId is provided in the request body
    const { close_rate, manual_auto, order_profit, closed_at } = req.body
    // Fetch data from DealModel based on userId
    const { id, order_id } = req.params;
    if (dealClosingLocks[`${id}_${order_id}`]) {
        return res.status(409).json({ msg: "Deals are already being closed for this dealer_id and order_id. Try again later." });
    }

    // Acquire the lock
    dealClosingLocks[`${id}_${order_id}`] = true;
    try {


        // Fetch data from DealModel based on userId and order_id
        const deals = await DealModelDemo.find({ dealer_id: id, order_id: order_id });

        // Use the fetched data to create entries in the ClosedDealModel
        const closedDeals = await ClosedDealModelDemo.create(deals.map(deal => ({
            // Map the fields accordingly based on your ClosedDeal model structure
            dealer_id: deal.dealer_id,
            order_id: deal.order_id,
            order_type: deal.order_type,
            title: deal.title,
            lotsize: deal.lotsize,
            created_at: deal.created_at,
            bidorask: deal.bidorask,
            takeprofit: deal.takeprofit,
            stoploss: deal.stoploss,
            order_profit,
            close_rate,
            manual_auto,
            closed_at
        })));

        await DealModelDemo.deleteMany({ dealer_id: id, order_id: order_id });
        const firstClosedDeal = closedDeals.length > 0 ? closedDeals[0] : {};
        const { order_profit: addedOrderProfit } = firstClosedDeal;
        return res.status(200).json({ msg: "Closed deals added successfully", order_profit: addedOrderProfit });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error in processing closed deals" });
    }
    finally {
        // Release the lock
        dealClosingLocks[`${id}_${order_id}`] = false;
    }
});

const dealClosingLock = {};

ClosedDealRouteDemo.post('/:id' , async (req, res) => {
    const { close_rate, manual_auto, order_profit, closed_at, order_id } = req.body;
    const { id } = req.params;

    // Check if deal exists with the provided order_id
    const deal = await DealModelDemo.findOne({ order_id, dealer_id: id });

    if (!deal) {
        return res.status(404).json({ msg: "Deal not found with the provided order_id" });
    }

    // Check if the deal is already being closed
    if (dealClosingLock[order_id]) {
        return res.status(400).json({ msg: "Deal is already being closed" });
    }

    // Set the lock to prevent multiple closings of the same deal
    dealClosingLock[order_id] = true;

    try {
        // Now you can use 'deal' to create a closed deal entry
        const closedDealData = {
            dealer_id: deal.dealer_id,
            order_id: deal.order_id,
            order_type: deal.order_type,
            title: deal.title,
            lotsize: deal.lotsize,
            created_at: deal.created_at,
            bidorask: deal.bidorask,
            takeprofit: deal.takeprofit,
            stoploss: deal.stoploss,
            order_profit,
            close_rate,
            manual_auto,
            closed_at
        };

        // Create a closed deal entry
        const closedDeal = await ClosedDealModelDemo.create(closedDealData);

        // Delete the deal with the provided order_id from DealModel
        await DealModelDemo.deleteOne({ order_id });

        // Release the lock after successfully closing the deal
        dealClosingLock[order_id] = false;

        return res.status(200).json({ msg: "Closed deal added successfully", closedDeal,order_profit });
    } catch (error) {
        console.error(error);
        // Release the lock in case of an error
        dealClosingLock[order_id] = false;
        return res.status(500).json({ msg: "Error in processing closed deal" });
    }

    
});





ClosedDealRouteDemo.put("/addprofit/:id", async (req, res) => {
    try {
        const accountId = req.params.id;
        const profitToAdd = parseFloat(req.body.profit); // Assuming profit is sent in the request body

        // Find the user record based on the account number
        const user = await DemouserModel.findOne({ AcNumber: accountId });

        if (user) {
            // Check if profitToAdd is negative
            if (profitToAdd < 0) {
                // Case 1: If netEq and totalbalance are zero, add to both
                if (user.neteq === 0 && user.totalbalance === 0) {
                    user.totalbalance += profitToAdd;
                    user.neteq += profitToAdd;
                    user.exposer+=(profitToAdd*500)
                } else if (user.neteq !== 0 && user.totalbalance !== 0) {
                    // Case 2: If netEq and totalbalance are not zero, add to both
                    user.totalbalance += profitToAdd;
                    user.neteq += profitToAdd;
                    user.exposer+=(profitToAdd*500)
                } else if (user.neteq === 0 && user.totalbalance !== 0) {
                    // Case 3: If netEq becomes zero and totalbalance is not zero, add to totalbalance
                    user.totalbalance += profitToAdd;
                    user.exposer+=(profitToAdd*500)
                } else if (user.neteq === 0 && user.totalbalance === 0) {
                    // Case 4: If netEq becomes zero and totalbalance becomes zero, set bonus to 0 and add to totalbalance and netEq
                    user.bonus = 0;
                    user.totalbalance += profitToAdd;
                    user.neteq += profitToAdd;
                    user.exposer+=(profitToAdd*500)
                }
                else if (user.neteq < 0 && user.totalbalance < 0) {
                    user.bonus = 0;
                    user.totalbalance += profitToAdd;
                    user.neteq += profitToAdd;
                    user.exposer+=(profitToAdd*500)
                }
            } else {
                // If profitToAdd is positive, add to both totalbalance and neteq
                user.totalbalance += profitToAdd;
                user.neteq += profitToAdd;
            }

            // Save the updated user record
            await user.save();

            // Create a new deposit entry for the user without modifying the existing DepositModel
            const newDeposit = new DepositModel({
                AccountNo: accountId,
                balance: user.totalbalance, // Use the updated totalbalance
                type_at: "deal", // You may want to set the order_id here
                // ... other fields if needed
            });

            // Save the new deposit entry
            const deposituser = await newDeposit.save();

            return res.status(200).send({
                AccountNo: accountId,
                totalBalance: user.totalbalance, // Updated totalbalance from userModel
                neteq: user.neteq,
                bonus: user.bonus,
            });
        } else {
            return res.status(404).send({ msg: "No user found for the provided account number" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Error in network" });
    }
});


ClosedDealRouteDemo.put("/addprofit/:id/:orderid", async (req, res) => {
    try {
        const accountId = req.params.id;
        const orderId=req.params.orderid;
        const profitToAdd = parseFloat(req.body.profit); // Assuming profit is sent in the request body

        // Find the user record based on the account number
        const deal = await ClosedDealModelDemo.findOne({ order_id: orderId });
        const user=await DemouserModel.findOne({ AcNumber: accountId})
        if (user) {
            // Check if profitToAdd is negative
            if (profitToAdd < 0) {
                // Case 1: If netEq and totalbalance are zero, add to both
                if (user.neteq === 0 && user.totalbalance === 0) {
                    user.totalbalance += profitToAdd;
                    user.neteq += profitToAdd;
                    // user.exposer+=(profitToAdd*500)
                } else if (user.neteq !== 0 && user.totalbalance !== 0) {
                    // Case 2: If netEq and totalbalance are not zero, add to both
                    user.totalbalance += profitToAdd;
                    user.neteq += profitToAdd;
                    // user.exposer+=(profitToAdd*500)
                } else if (user.neteq === 0 && user.totalbalance !== 0) {
                    // Case 3: If netEq becomes zero and totalbalance is not zero, add to totalbalance
                    user.totalbalance += profitToAdd;
                } else if (user.neteq === 0 && user.totalbalance === 0) {
                    // Case 4: If netEq becomes zero and totalbalance becomes zero, set bonus to 0 and add to totalbalance and netEq
                    user.bonus = 0;
                    user.totalbalance += profitToAdd;
                    user.neteq += profitToAdd;
                    // user.exposer+=(profitToAdd*500)
                } 
                if (user.neteq < 0 && user.totalbalance < 0) {
                    user.bonus = 0;
                    user.totalbalance += profitToAdd;
                    user.neteq += profitToAdd;
                    // user.exposer+=(profitToAdd*500)
                }
            } else {
                // If profitToAdd is positive, add to both totalbalance and neteq
                user.totalbalance += profitToAdd;
                user.neteq += profitToAdd;
                // user.exposer+=(profitToAdd*500)
            }

            // Save the updated user record
            await user.save();

            // Create a new deposit entry for the user without modifying the existing DepositModel
            const newDeposit = new DepositModel({
                AccountNo: accountId,
                balance: user.totalbalance, // Use the updated totalbalance
                type_at: "deal", 
                order_id: orderId,
                // You may want to set the order_id here
                // ... other fields if needed
            });

            // Save the new deposit entry
            const deposituser = await newDeposit.save();

            return res.status(200).send({
                AccountNo: accountId,
                totalBalance: user.totalbalance, // Updated totalbalance from userModel
                neteq: user.neteq,
                bonus: user.bonus,
            });
        } else {
            return res.status(404).send({ msg: "No user found for the provided account number" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Error in network" });
    }
});





// ClosedDealRoute.use(authentication);

ClosedDealRouteDemo.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deals = await ClosedDealModelDemo.find({ dealer_id: id })
        return res.status(200).send(deals)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error while fetching deals" })
    }


})







module.exports = ClosedDealRouteDemo;
