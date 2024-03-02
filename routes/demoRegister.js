const express=require("express");


const registerRouteDemo = express.Router();
const bcrypt = require('bcrypt');
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")

const { DemouserModel } = require('../models/demo.UserModel');
const DepositModel = require('../models/adminDeposit.Model');
const { userModel } = require("../models/UserModel");










registerRouteDemo.get('/:id', async (req, res) => {
    try {
        const { totalbalance, net ,AcNumber} = req.body;

        // Find the user by AcNumber
        let user = await userModel.findOne({ AcNumber: req.params.id });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                msg: 'User not found',
            });
        }

        // Check if a demo user with the modified AcNumber already exists
        const existingDemoUser = await DemouserModel.findOne({ AcNumber: user.AcNumber + "DEMO" });

        if (existingDemoUser) {
            return res.status(400).json({
                msg: 'Demo user already exists',
                type:existingDemoUser
            });
        }

        // Hash password (if needed)
        // bcrypt.hash(password, 4, async (err, hash) => {
        //     if (err) {
        //         return res.status(500).json({
        //             msg: 'Something went wrong, please try again later!',
        //         });
        //     }

        // Create a new demo user
        const newDemoUser = new DemouserModel({
            first_name: user.first_name,
            last_name: user.last_name,
            totalbalance,
            net,
            AcNumber: user.AcNumber + "DEMO",
        });

        // Save the new demo user
        let savedDemoUser = await newDemoUser.save();

        res.json({
            msg: 'An email sent, please verify successfully',
            type: savedDemoUser,
        });
        // });
    } catch (error) {
        console.error(error);
        res.status(502).json({
            msg: 'Not registered, please try again',
        });
    }
});

// const { authentication } = require("../middlewares/authenication")
// registerRouteU.use(authentication);

registerRouteDemo.get('/user/:userID', async (req, res) => {
    try {
        if(req.params.userID==="admin"){
            const user = await DemouserModel.find({ });
        return res.status(200).send(user);
        }
        const user = await DemouserModel.findOne({ AcNumber: req.params.userID });
        return res.status(200).send({
            msg: 'An email sent, please verify successfully',
            type: user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: "Error In Get All Users"
        });
    }
})



// registerRouteDemo.put('/:userID', async (req, res) => {
//     try {
//         const newData = req.body;
//          console.log(newData);
//         // Update the user data in the database
//         const updatedUser = await userModel.findOneAndUpdate(
//             { AcNumber: req.params.userID },
//             newData, // Directly pass newData to $set
//             { new: true }
//         );
          
//         if (updatedUser) {
//             return res.status(200).send({
//                 msg: "User data updated successfully",
//                 user: updatedUser
//             });
//         } else {
//             return res.status(404).send({
//                 msg: "User not found"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             msg: "Error in updating user data"
//         });
//     }
// });



// registerRouteDemo.delete('/:userID', async (req, res) => {
//     try {
//         // Delete the user data from the database
//         const deletedUser = await userModel.findOneAndDelete({ AcNumber: req.params.userID });

//         if (deletedUser) {
//             return res.status(200).send({
//                 msg: "User deleted successfully",
//                 user: deletedUser
//             });
//         } else {
//             return res.status(404).send({
//                 msg: "User not found"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             msg: "Error in deleting user"
//         });
//     }
// });





module.exports = registerRouteDemo