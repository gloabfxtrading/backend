const express = require("express");
const AdminModel = require('../models/Admin.Model');
const AdminRouteRegister = express.Router();
const bcrypt = require("bcrypt")

AdminRouteRegister.post('/', async (req, res) => {
    try {
        const {mobile, email, password, type } = req.body;

        bcrypt.hash(password, 4, async (err, hash) => {
            const new_admin = new AdminModel({
                mobile,
                email,
                password: hash,
                type
            })
            const admin = await new_admin.save();
            return res.status(200).send({ msg: "Created admin sucessfully", admin })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Failed to register" })
    }
})

AdminRouteRegister.post('/change', async (req, res) => {
    console.log("hi")
    try {
        const { email, password } = req.body;
        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                msg: 'Both email and password are required'
            });
        }

        // Check if the email exists in the userModel
        const user = await AdminModel.findOne({ email });

        console.log('Email:', email);
        console.log('User:', user);

        if (user) {
            // Hash the new password
            const hash = await bcrypt.hash(password, 10); // Use a higher saltRounds value

            // Update the hashed password in the database
            await AdminModel.updateOne({ email }, { password: hash });

            res.status(200).json({
                msg: 'Password updated successfully'
            });
        } else {
            res.status(400).json({
                msg: 'User not found'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Failed to update password',
            error: error.message
        });
    }
});


module.exports = AdminRouteRegister