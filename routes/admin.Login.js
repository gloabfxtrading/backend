const express = require("express");
const AdminModel = require("../models/Admin.Model");

const AdminRouteLogin = express.Router();
const bcrypt = require("bcrypt");

AdminRouteLogin.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email });
        const model = admin
        const hashed_password = model.password;
        const result = await bcrypt.compare(password, hashed_password)

        if (result) {
            return res.status(200).send({
                msg: "Login successfully",
                type: model
            })
        }else{
            return res.status(500).send({msg:"Invalid email or password"})
        }
    } catch (error) {
       return res.status(500).send({msg:"failed to fetch data"})
    }
})



module.exports=AdminRouteLogin