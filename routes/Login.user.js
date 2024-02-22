const express = require('express');
const LoginVRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const { userModel } = require('../models/UserModel');
const Token = require('../models/token');
const AdminModel = require('../models/Admin.Model');


LoginVRoutes.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email exists in either vendorModel or userModel

        const user = await userModel.findOne({ email });
        const admin = await AdminModel.findOne({ email });
        const model = user || admin
        const hashed_password = model.password;
        const result = await bcrypt.compare(password, hashed_password);
        if (!user) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                const url = `${process.env.BASE_URL}/users/${user.id}/verify/${token.token}`;
                await sendEmail(user.email, "Verify Email", url);
            }
        }
        if (result) {
            const token = jwt.sign({ _id: model._id, userType: user }, process.env.SECRET_KEY);

            return res.status(200).json({
                msg: `Login successfully `,
                type: model,
                token: token,

            });
        } else {
            return res.status(400).json({
                msg: 'Wrong password, Please try again later'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Login failed, Invalid credentials"
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
