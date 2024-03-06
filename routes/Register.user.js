const express = require('express');
const registerRouteU = express.Router();
const bcrypt = require('bcrypt');
const token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")

const { userModel } = require('../models/UserModel');
const DepositModel = require('../models/adminDeposit.Model');



const generateAccountNumber = async () => {
    const startNumber = 1000100001; // Starting number for the account number
    const lastUser = await userModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let lastNumber = startNumber; // Initialize with the starting number

    if (lastUser) {
        const lastAccountNumber = lastUser.AcNumber;

        if (lastAccountNumber && lastAccountNumber >= startNumber) {
            lastNumber = lastAccountNumber + 1;
        }
    }

    let newNumber;
    do {
        newNumber = lastNumber++;
        const newAcNumber = newNumber.toString().padStart(10, '0');
        const existingUser = await userModel.findOne({ AcNumber: newAcNumber });

        if (!existingUser) {
            return newAcNumber;
        }

        // If the generated account number already exists, try again with the next number
    } while (true);
};







registerRouteU.post('/', async (req, res) => {
    try {
        const {
            first_name, last_name, email, password, street_add, zip_code, city, state, country, dob, phone, account_type, leverage,totalbalance,net
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
                totalbalance,
                net,
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
            // const deposit = new DepositModel({
            //     AccountNo: user.AcNumber,
            //     balance: 0,
            // });

            // await deposit.save();
            const Token = await new token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save()
            const url = `Dear user, please click on below link to verify your account
            ${process.env.BASE_URL}/users/${user._id}/verify/${Token.token}`

            console.log(user.email)
            await sendEmail(user.email, "verify", url)
            res.json({
                msg: 'an email sent plzz verify successfully',
            });
        });
    } catch (error) {
        console.log(error);
        res.status(502).send({
            msg: 'Not registered, please try again',
        });
    }
});

// const { authentication } = require("../middlewares/authenication")
// registerRouteU.use(authentication);

registerRouteU.get('/:userID', async (req, res) => {
    try {
        if(req.params.userID==="admin"){
            const user = await userModel.find({ });
        return res.status(200).send(user);
        }
        const user = await userModel.findOne({ AcNumber: req.params.userID });
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: "Error In Get All Users"
        });
    }
})



registerRouteU.put('/:userID', async (req, res) => {
    try {
        const newData = req.body;
         console.log(newData);
        // Update the user data in the database
        const updatedUser = await userModel.findOneAndUpdate(
            { AcNumber: req.params.userID },
            newData, // Directly pass newData to $set
            { new: true }
        );
          
        if (updatedUser) {
            return res.status(200).send({
                msg: "User data updated successfully",
                user: updatedUser
            });
        } else {
            return res.status(404).send({
                msg: "User not found"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: "Error in updating user data"
        });
    }
});



registerRouteU.delete('/:userID', async (req, res) => {
    try {
        // Delete the user data from the database
        const deletedUser = await userModel.findOneAndDelete({ AcNumber: req.params.userID });

        if (deletedUser) {
            return res.status(200).send({
                msg: "User deleted successfully",
                user: deletedUser
            });
        } else {
            return res.status(404).send({
                msg: "User not found"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: "Error in deleting user"
        });
    }
});





registerRouteU.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id })
        if (!user) return res.status(400).send({ msg: "invalid link" })

        const Token = await token.findOne({
            userId: user._id,
            token: req.params.token
        })

        if (!token) return res.status(400).send({ message: "invalid link" })
        await user.updateOne({ _id: user._id, verified: true });

        // Use deleteOne instead of remove
        await token.deleteOne({
            userId: user._id,
            token: req.params.token
        });

        res.status(200).send({ msg: "Email verified successfully " })

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server Error" })
    }
})
module.exports = registerRouteU