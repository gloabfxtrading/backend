const express = require('express');
const LoginVRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const { userModel } = require('../models/UserModel');


LoginVRoutes.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if the email exists in either vendorModel or userModel
       
        const user = await userModel.findOne({ email });
        

       
            const model =  user
            const hashed_password = model.password;
            const result = await bcrypt.compare(password, hashed_password);

            if (result) {
                const token = jwt.sign({ _id: model._id, userType:user }, process.env.SECRET_KEY);
                return res.status(200).json({
                    msg: `Login successfully `,
                    type:model,
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

module.exports = LoginVRoutes;
