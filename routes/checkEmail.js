const express = require('express');
const { userModel } = require('../models/UserModel');
const Checkmail = express.Router();

Checkmail.post('/email', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is already registered in the database
        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(200).json({
                msg: "Email already registered"
            });
        } else {
            return res.status(400).json({
                msg: 'Redirected to next page'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
});


Checkmail.post('/phone', async (req, res) => {
    try {
        const { phone } = req.body;

        const user = await userModel.findOne({ phone });
        if (user) {
            return res.status(200).json({
                msg: "Mobile No already registered",
                status:"error"
            });
        } else {
            return res.status(400).json({
                msg: 'Redirected to next page',status:"success"
            });
        }
    } catch (error) {
        return res.status(400).json({
            msg: 'Error while checking',status:"error"
        });
    }

})

module.exports=Checkmail;