const express = require("express");
const ClosedDealRoute = express.Router();
const DealModel = require("../models/Deal");
const ClosedDealModel = require("../models/ClosedDeal");
const DepositModel = require("../models/adminDeposit.Model");

ClosedDealRoute.post('/:id/:order_id', async (req, res) => {
    try {
        // Assuming userId is provided in the request body
         const {close_rate,manual_auto,order_profit,closed_at}=req.body
        // Fetch data from DealModel based on userId
        const { id, order_id } = req.params;

        // Fetch data from DealModel based on userId and order_id
        const deals = await DealModel.find({ dealer_id: id, order_id: order_id });
           
        // Use the fetched data to create entries in the ClosedDealModel
        const closedDeals = await ClosedDealModel.create(deals.map(deal => ({
            // Map the fields accordingly based on your ClosedDeal model structure
            dealer_id: deal.dealer_id,
            order_id:deal.order_id,
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
       
        await DealModel.deleteMany({ dealer_id: id, order_id: order_id });
        const firstClosedDeal = closedDeals.length > 0 ? closedDeals[0] : {};
        const { order_profit: addedOrderProfit } = firstClosedDeal;
        return res.status(200).json({ msg: "Closed deals added successfully", order_profit: addedOrderProfit });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error in processing closed deals" });
    }
});

ClosedDealRoute.get("/:id",async(req,res)=>{
    try {
        const {id}=req.params;

        const deals=await ClosedDealModel.find({dealer_id:id})
        return res.status(200).send(deals)
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Error while fetching deals"})
    }
   

})


ClosedDealRoute.put("/addprofit/:id", async (req, res) => {
    try {
        const accountId = req.params.id;
        const orderId = req.params.order_id;
        const profitToAdd = req.body.profit; // Assuming profit is sent in the request body

        // Find the user record based on the account number
        const user = await userModel.findOne({ AcNumber: accountId });

        if (user) {
            // Update the totalbalance in userModel
            user.totalbalance += parseFloat(profitToAdd);
            user.netEq+=parseFloat(profitToAdd);

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
                net:user.net
            });
        } else {
            return res.status(404).send({ msg: "No user found for the provided account number" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Error in network" });
    }
});




module.exports = ClosedDealRoute;
