const express = require('express');
const registerRouteU = express.Router();
const bcrypt = require('bcrypt');

const { userModel } = require('../models/UserModel');

const generateAccountNumber = async () => {
    const lastUser = await userModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let lastNumber = 0;

    if (lastUser) {
        const lastAccountNumber = lastUser.AcNumber;

        if (lastAccountNumber && lastAccountNumber.startsWith('GFX')) {
            lastNumber = parseInt(lastAccountNumber.substring(3), 10);
        }
    }

    const newNumber = lastNumber + 1;
    const formattedNumber = newNumber.toString().padStart(6, '0');
    return `GFX${formattedNumber}`;
};

registerRouteU.post('/', async (req, res) => {
    try {
        const {
            first_name, last_name, email, password, street_add, zip_code, city, state, country, dob, phone, account_type, leverage
        } = req.body;

        const accountNumber = await generateAccountNumber();
        console.log(accountNumber);

        bcrypt.hash(password, 4, async (err, hash) => {
            if (err) {
                return res.json({
                    msg: 'Something wrong, Please try again later !',
                });
            }

            const new_user = new userModel({
                first_name,
                last_name,
                email,
                password: hash,
                street_add,
                zip_code,
                city,
                state,
                country,
                dob,
                phone,
                account_type,
                leverage,
                AcNumber:accountNumber,
            });

            const existingNo = await userModel.findOne({ phone });
            if (existingNo) {
                return res.status(400).json({
                    msg: 'Number is already registered. Provide a new number.',
                });
            }

            // Check if the email is already present
            const user = await userModel.findOne({ email });
            if (user) {
                return res.status(400).json({
                    msg: 'This email is already present. Try logging in.',
                });
            }

            await new_user.save();
            res.json({
                msg: 'Registered successfully',
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Not registered, please try again',
        });
    }
});

// const { authentication } = require("../middlewares/authenication")
// registerRouteU.use(authentication);

// registerRouteU.get('/:userID', async (req, res) => {
//     try {
//         const user = await userModel.find({ _id: req.params.userID });
//         return res.status(200).send(user);
//     }
//     catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             msg: "Error In Get All Users"
//         });
//     }
// })

module.exports = registerRouteU