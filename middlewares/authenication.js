require("dotenv").config()
const { userModel } = require("../models/UserModel");
const jwt = require("jsonwebtoken");


const authentication = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]  //optional chaining
    if (!token) {
        return res.send({
            msg: 'please login first as user'
        });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (err, decorded) => {
        if (err) {
            return res.send({msg:"please login"});
        }
        const user_id = decorded.user_id
        const user = await userModel.findOne({ _id: user_id })
        req.user = user
        next()
    })
}

module.exports =  authentication;