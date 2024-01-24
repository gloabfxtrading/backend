const express = require('express');
const registerRouteU = express.Router();
const bcrypt = require('bcrypt');
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")

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

    let newNumber;
    do {
        newNumber = lastNumber + 1;
        const formattedNumber = newNumber.toString().padStart(6, '0');
        const newAcNumber = `GFX${formattedNumber}`;
        const existingUser = await userModel.findOne({ AcNumber: newAcNumber });

        if (!existingUser) {
            return newAcNumber;
        }

        // If the generated account number already exists, try again with the next number
        lastNumber++;
    } while (true);
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
                AcNumber: accountNumber,
            });

            const existingNo = await userModel.findOne({ phone });
            if (existingNo) {
                return res.status(400).json({
                    msg: 'Number is already registered. Provide a new number.',
                });
            }

            // Check if the email is already present
            let user = await userModel.findOne({ email });
            if (user) {
                return res.status(400).json({
                    msg: 'This email is already present. Try logging in.',
                });
            }

             user = await new_user.save();
            const token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save()
            const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`
            
            console.log(user.email)
            await sendEmail(user.email, "verify", url)
            res.json({
                msg: 'an email sent plzz verify successfully',
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



registerRouteU.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id })
        if (!user) return res.status(400).send({ msg: "invalid link" })

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        })

        if (!token) return res.status(400).send({ message: "invalid link" })
        await user.updateOne({ _id: user._id, verified: true });

        // Use deleteOne instead of remove
        await Token.deleteOne({
            userId: user._id,
            token: req.params.token   
        });

        res.status(200).send({msg:"Email verified successfully "})

    } catch (error) {
       console.log(error);
       res.status(500).send({msg:"Internal server Error"})
    }
})
module.exports = registerRouteU