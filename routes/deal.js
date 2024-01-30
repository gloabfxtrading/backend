const express = require("express");
const dealRoute = express.Router();
const bcrypt = require("bcrypt");

const ClosedDealModel=require("../models/ClosedDeal")
const DealModel = require("../models/Deal");

const {userModel} =require("../models/UserModel")


const generateAccountNumber = async () => {
    const lastDeal = await DealModel.findOne({}, {}, { sort: { 'created_at': -1 } });
    let lastNumber = 0;

    if (lastDeal) {
        const lastOrderID = lastDeal.order_id;

        if (lastOrderID && lastOrderID.startsWith('GFXTRAD')) {
            lastNumber = parseInt(lastOrderID.substring(7), 10);
        }
    }

    let newNumber;
    do {
        newNumber = lastNumber + 1;
        const formattedNumber = newNumber.toString().padStart(6, '0');
        const newOrderID = `GFXTRAD${formattedNumber}`;
        const existingDeal = await DealModel.findOne({ order_id: newOrderID });
        const existingClosedDeal = await ClosedDealModel.findOne({ order_id: newOrderID });

        if (!existingDeal && !existingClosedDeal) {
            return newOrderID;
        }

        // If the generated order_id already exists, try again with the next number
        lastNumber++;
    } while (true);
};

dealRoute.post('/', async (req, res) => {
    try {
        const { dealer_id,order_type, title, lotsize, created_at, bidorask, takeprofit, stoploss } = req.body
        const accountNumber = await generateAccountNumber();
        const new_user = new DealModel({
            order_id: accountNumber,
            dealer_id,
            order_type,
            title,
            lotsize,
            created_at,
            bidorask,
            takeprofit: takeprofit || null, // Use provided value or set to null
            stoploss: stoploss || null,
        });
        let user = await new_user.save();
        return res.status(200).send({ msg: "added sucessfully", user });
    } catch (error) {
        return res.status(500).send({
            msg: "Error In Deal"
        });
    }
})


dealRoute.get('/:id', async (req, res) => {
    try {
         let deal=await DealModel.find({dealer_id:req.params.id})
         return res.status(200).send(deal)
    } catch (error) {
        return res.status(500).send({
            msg: "Error while Deal"
        });
    }
})

module.exports = dealRoute