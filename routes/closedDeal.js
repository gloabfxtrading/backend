const express = require("express");
const ClosedDealRoute = express.Router();
const DealModel = require("../models/Deal");
const ClosedDealModel = require("../models/ClosedDeal");

ClosedDealRoute.post('/:id/:order_id', async (req, res) => {
    try {
        // Assuming userId is provided in the request body
         const {close_rate,manual_auto,order_profit}=req.body
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
            manual_auto 
        })));
          
        await DealModel.deleteMany({ dealer_id: id, order_id: order_id });
        return res.status(200).json({ msg: "Closed deals added successfully", closedDeals });
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

module.exports = ClosedDealRoute;
