const nodemailer = require('nodemailer');
const {userModel} = require('../models/UserModel');
const express=require("express");
const ForgetPass=express.Router();
// ... (other code)

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
// Function to send email with OTP
async function sendVerificationEmail(email, otp) {
    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        post: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.EMAIL_PORT),
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        }
    });

    // Email content
    let mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Email Verification - Your App',
        text: `Your OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`,
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
}

// Endpoint to initiate the email verification process
ForgetPass.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    // Check if the user with the provided email exists
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Generate and store OTP for the user
    const otp = generateOTP();

    try {
        // Update the user with the generated OTP and timestamp
        await userModel.findOneAndUpdate({ email }, { otp, otpTimestamp: Date.now() });

        // Send the verification email
        sendVerificationEmail(email, otp);

        res.json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Endpoint to verify the OTP and allow password change
ForgetPass.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Retrieve user from the database
        const user = await userModel.findOne({ email });

        // Check if the user exists and OTP is correct
        if (user && user.otp && user.otp.toString().trim() === otp.toString().trim()){
            console.log('Stored OTP:', user.otp);
            // Check if OTP is still valid (within 10 minutes)
            const timeElapsed = Date.now() - user.otpTimestamp;
            if (timeElapsed <= 10 * 60 * 1000) {
                res.json({ message: 'OTP verified successfully. You can now change your password.' });
            } else {
                res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
            }
        } else {
            res.status(400).json({ message: 'Invalid OTP.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports=ForgetPass
