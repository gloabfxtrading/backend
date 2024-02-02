const express = require("express");
const ClosedDealModel = require("../models/ClosedDeal");
const BalModel = require("../models/UpdateBalance");
const UpdateProfitRoute = express.Router();

// UpdateProfitRoute.get('/:id/:order_id', async (req, res) => {
//     try {
//         const order_profit = parseFloat(req.query.order_profit)
//         const { id, order_id } = req.params;

//         const deal = await ClosedDealModel.findOne({ dealer_id: id, order_id: order_id })
//         const closeddeal = await BalModel.create({
//             dealer_id:deal.dealer_id,
//                 order_id:deal.order_id,
//                 order_profit:deal.order_profit
//         })
//         return res.status(200).send(closeddeal);
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({msg:"error while fetching"})
//     }
// })

// UpdateProfitRoute.get('/:id/:order_id', async (req, res) => {
//     try {
//         const order_profit = parseFloat(req.query.order_profit);
//         const { id, order_id } = req.params;

//         const deal = await ClosedDealModel.findOne({ dealer_id: id, order_id: order_id });

//         if (!deal) {
//             return res.status(404).send({ msg: "No closed deal found for the provided dealer_id and order_id" });
//         }

//         // Find or create a document in BalModel
//         const closeddeal = await BalModel.findOne({ dealer_id: id }) || new BalModel({ dealer_id: id });

//         // Update the totalBalance with order_profit
//         closeddeal.totalBalance = (closeddeal.totalBalance || 0) + order_profit;

//         // Save the updated document
//         await closeddeal.save();

//         return res.status(200).send(closeddeal);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ msg: "Error while fetching" });
//     }
// });

module.exports = UpdateProfitRoute