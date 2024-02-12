const { userModel } = require("../models/UserModel");
const express = require("express");
const bcrypt = require("bcrypt");
const changePasswordRoutes = express.Router();

changePasswordRoutes.post('/:id', async (req, res) => {
    try {
        const { oldpassword, newPassword } = req.body;

        // Find the user by AcNumber
        const user = await userModel.findOne({ AcNumber: req.params.id });

        if (user) {
            // Compare old password with the stored hashed password
            const isPasswordMatch = await bcrypt.compare(oldpassword, user.password);

            if (isPasswordMatch) {
                // Hash the new password
                const hash = await bcrypt.hash(newPassword, 3);

                // Update the hashed password in the database
                await userModel.updateOne({ AcNumber: req.params.id }, { password: hash });

                res.status(200).json({
                    msg: 'Password updated successfully',
                    "status":"success"
                });
            } else {
                res.status(200).json({
                    msg: 'Old password does not match',
                    "status":"error"
                });
            }
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

module.exports = changePasswordRoutes;



module.exports=changePasswordRoutes