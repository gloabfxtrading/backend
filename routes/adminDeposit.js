const express = require("express");
const nodemailer = require('nodemailer');
const { userModel } = require("../models/UserModel");
const DepositModel = require("../models/adminDeposit.Model");
const AdminDeposit = express.Router();
const authentication=require("../middlewares/authenication");
const { DemouserModel } = require("../models/demo.UserModel");

// async function sendVerificationEmail(first, last, balance, created_at, email) {
//     // Create a Nodemailer transporter
//     let transporter = nodemailer.createTransport({
//         host: process.env.HOST,
//         service: process.env.SERVICE,
//         post: Number(process.env.EMAIL_PORT),
//         secure: Boolean(process.env.EMAIL_PORT),
//         auth: {
//             user: process.env.USER,
//             pass: process.env.PASS,
//         }
//     });

//     // Email content
//     let mailOptions = {
//         from: process.env.USER,
//         to: email,
//         subject: 'forexbankalerts@gloabfx.com',
//         text: `Dear ${first} ${last},
        
//         we wish to infrom you that your account is credited by $ ${balance} on ${created_at.toLocaleString('en-IN', {
//             timeZone: 'Asia/Kolkata',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: 'numeric',
//             minute: 'numeric',
//             second: 'numeric',
//         })} , Regards gloabfx.com`,
//     };

//     // Send the email
//     let info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ', info.messageId);
// }


AdminDeposit.post('/', async (req, res) => {
    try {
        const { AccountNo, balance, type_at,bonus } = req.body;

        // Check if a user with the given AccountNo exists
        const existingUser = await userModel.findOne({ AcNumber: AccountNo });

        if (!existingUser) {
            return res.status(404).send({ msg: "User not available" });
        }

        // Create a new deposit entry for the user
        const deposit = new DepositModel({
            AccountNo,
            balance,
            bonus,
            type_at: "deposit"

        });

        // Save the deposit entry
        const deposituser = await deposit.save();
        console.log(balance)

        // Update the totalbalance in userModel
        const newTotalBalance = parseFloat(existingUser.totalbalance) + parseFloat(balance)+parseFloat(bonus);
        const newneteq = parseFloat(existingUser.neteq) + parseFloat(balance)
        const bonuscustomer=parseFloat(existingUser.bonus)+parseFloat(bonus);
        // console.log(newTotalBalance)
        
            existingUser.totalbalance = newTotalBalance;
            existingUser.neteq = newneteq
            existingUser.bonus=bonuscustomer
            await existingUser.save();
            // sendVerificationEmail(existingUser.first_name, existingUser.last_name, balance, deposituser.created_at, existingUser.email);
            return res.status(200).send({ msg: "Amount added successfully", deposituser });
       
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).send({ msg: "Error in network", error: error.message });
    }
});


AdminDeposit.post('/demo', async (req, res) => {
    try {
        const { AccountNo, balance, type_at,bonus } = req.body;

        // Check if a user with the given AccountNo exists
        const existingUser = await DemouserModel.findOne({ AcNumber: AccountNo });

        if (!existingUser) {
            return res.status(404).send({ msg: "User not available" });
        }

        // Create a new deposit entry for the user
        const deposit = new DepositModel({
            AccountNo,
            balance,
            bonus,
            type_at: "deposit"

        });

        // Save the deposit entry
        const deposituser = await deposit.save();
        console.log(balance)

        // Update the totalbalance in userModel
        const newTotalBalance = parseFloat(existingUser.totalbalance) + parseFloat(balance)+parseFloat(bonus);
        const newneteq = parseFloat(existingUser.neteq) + parseFloat(balance)
        const bonuscustomer=parseFloat(existingUser.bonus)+parseFloat(bonus);
        // console.log(newTotalBalance)
        
            existingUser.totalbalance = newTotalBalance;
            existingUser.neteq = newneteq
            existingUser.bonus=bonuscustomer
            await existingUser.save();
            // sendVerificationEmail(existingUser.first_name, existingUser.last_name, balance, deposituser.created_at, existingUser.email);
            return res.status(200).send({ msg: "Amount added successfully", deposituser });
       
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).send({ msg: "Error in network", error: error.message });
    }
});



AdminDeposit.use(authentication)
AdminDeposit.get("/:id", async (req, res) => {
    try {
        if (req.params.id === "asdf1234") {
            const depositList = await DepositModel.find();
            return res.status(200).send(depositList)
        } else {
            return res.status(500).send({ msg: "No user Found" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Error in network" })
    }
})


module.exports = AdminDeposit;