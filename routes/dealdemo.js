const express = require("express");
const dealRouteDemo = express.Router();
const bcrypt = require("bcrypt");

const ClosedDealModelDemo = require("../models/Closeddeal.Demo.Model")
const DealModelDemo = require("../models/dealDemo");

const { DemouserModel } = require("../models/demo.UserModel")


const generateAccountNumber = async () => {
    const lastDeal = await DealModelDemo.findOne({}, {}, { sort: { 'created_at': -1 } });
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
        const existingDeal = await DealModelDemo.findOne({ order_id: newOrderID });
        const existingClosedDeal = await ClosedDealModelDemo.findOne({ order_id: newOrderID });

        if (!existingDeal && !existingClosedDeal) {
            return newOrderID;
        }

        // If the generated order_id already exists, try again with the next number
        lastNumber++;
    } while (true);
};

dealRouteDemo.post('/', async (req, res) => {
    try {
        const {
            dealer_id,
            order_type,
            title,
            lotsize,
            created_at,
            bidorask,
            takeprofit,
            stoploss,
            price,
            pip,
            changecurr
        } = req.body;
        const part1 = title.substring(0, 3); // Get the first 3 characters (EUR)
        const part2 = title.substring(3);    // Get the remaining characters (USD)
        // Assuming generateAccountNumber is a function that generates a unique account number
        const accountNumber = await generateAccountNumber();

        const newDeal = new DealModelDemo({
            order_id: accountNumber+"D",
            dealer_id,
            order_type,
            title: part1 + '/' + part2,
            lotsize,
            created_at,
            bidorask,
            takeprofit: takeprofit || null,
            stoploss: stoploss || null,
            price,
            pip,
            changecurr
        });

        const savedDeal = await newDeal.save();

        return res.status(200).send({ msg: "Deal added successfully", deal: savedDeal });
    } catch (error) {
        console.error("Error in Deal POST request:", error);
        return res.status(500).send({ msg: "Error in Deal" });
    }
});



dealRouteDemo.get('/:id', async (req, res) => {
    try {
        let deal = await DealModelDemo.find({ dealer_id: req.params.id })
        return res.status(200).send(deal)
    } catch (error) {
        return res.status(500).send({
            msg: "Error while Deal"
        });
    }
})

dealRouteDemo.get('/:id/dealprice', async (req, res) => {
    try {
        // Use MongoDB aggregation framework to get the sum of prices for a specific dealer_id
        let result = await DealModelDemo.aggregate([
            {
                $match: { dealer_id: req.params.id }
            },
            {
                $group: {
                    _id: null,
                    total_price: { $sum: "$price" }
                }
            }
        ]);

        // Check if there are deals for the provided dealer_id
        if (result.length === 0) {
            return res.status(404).send({
                total_price: 0
            });
        }

        // Send the total_price in the response
        return res.status(200).send({
            total_price: result[0].total_price
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            msg: "Error while fetching deals"
        });
    }
});


dealRouteDemo.get("/singledeal/:id", async (req, res) => {
    try {
        const user = await DealModelDemo.findOne({ order_id: req.params.id })
        return res.status(200).send(user)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Error while fetching" })
    }
})

module.exports = dealRouteDemo