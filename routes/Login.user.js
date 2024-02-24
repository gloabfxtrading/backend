const express = require('express');
const LoginVRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const { userModel } = require('../models/UserModel');

const AdminModel = require('../models/Admin.Model');
const sendEmail = require('../utils/sendEmail');
const token = require('../models/token');


LoginVRoutes.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email exists in either vendorModel or userModel
        const user = await userModel.findOne({ email });
        const admin = await AdminModel.findOne({ email });
        const model = user || admin;

        if (!model) {
            return res.status(400).json({
                msg: 'User not found with the provided email',
            });
        }

        const hashed_password = model.password;
        const result = await bcrypt.compare(password, hashed_password);

        if (!result) {
            return res.status(400).json({
                msg: 'Wrong password, please try again later',
            });
        }

        let userId = null;

        if (model._id) {
            userId = model._id;
        } else if (model.id) {
            userId = model.id;
        }

        if (!userId) {
            return res.status(500).json({
                msg: 'Error getting user ID',
            });
        }

        let token = await token.findOne({ userId });

        if (!token) {
            token = await new token({
                userId,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
            const url = `${process.env.BASE_URL}/users/${userId}/verify/${token.token}`;
            await sendEmail(model.email, "Verify Email", url);
        }

        const userType = user ? user : admin;
        let toke = jwt.sign({ _id: userId, userType }, process.env.SECRET_KEY, {expiresIn: 36000});

        return res.status(200).json({
            msg: 'Login successfully',
            type: userType,
            token: toke,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Login failed, Invalid credentials',
        });
    }
});


LoginVRoutes.post('/logout', async (req, res) => {
    try {

        
        console.log('req.user:', req.user); // Add this line for debugg
        // Assuming you have a way to identify the user (e.g., using user ID or token)
        const userId = req.user ? req.user._id : null; // Check if req.user is defined

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }

        // Clear the token from the Token collection in the database
        await token.findOneAndDelete({ userId });

        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: "Logged out"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
        });
    }
});






LoginVRoutes.post('/user', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email exists in either vendorModel or userModel
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                msg: 'User not found. Please check your email.',
            });
        }

        const hashed_password = user.password; // Assuming you want to compare with the hashed password stored in the database

        if (password === hashed_password) {
            const token = jwt.sign({ _id: user._id, userType: user }, process.env.SECRET_KEY);

            return res.status(200).json({
                msg: `Login successfully `,
                type: user,
                token: token,
            });
        } else {
            return res.status(400).json({
                msg: 'Wrong password. Please try again later.',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Login failed, Invalid credentials"
        });
    }
});








// change password



module.exports = LoginVRoutes;
// LoginVRoutes.post('/', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Check if the email exists in either vendorModel or userModel

//         const user = await userModel.findOne({ email });
//         const admin = await AdminModel.findOne({ email });
//         const model = user || admin
//         const hashed_password = model.password;
//         const result = await bcrypt.compare(password, hashed_password);
//         if (!user) {
//             let token = await Token.findOne({ userId: user._id });
//             if (!token) {
//                 token = await new Token({
//                     userId: user._id,
//                     token: crypto.randomBytes(32).toString("hex"),
//                 }).save();
//                 const url = `${process.env.BASE_URL}/users/${user.id}/verify/${token.token}`;
//                 await sendEmail(user.email, "Verify Email", url);
//             }
//         }
//         if (result) {
//             const userType = user ? 'user' : 'admin';
//             const token = jwt.sign({ _id: model._id, userType}, process.env.SECRET_KEY);

//             return res.status(200).json({
//                 msg: `Login successfully `,
//                 type: model,
//                 token: token,

//             });
//         } else {
//             return res.status(400).json({
//                 msg: 'Wrong password, Please try again later'
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             msg: "Login failed, Invalid credentials"
//         });
//     }
// });