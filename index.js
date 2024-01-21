
const mongoose=require("mongoose")
const express = require("express");
const { connection } = require('./config/db');

require("dotenv").config();
const app = express();
app.use(express.json());

// const cors = require('cors') ;
// app.use(cors({
//     origin:'*'
// }))

app.get("/", (req, res) => {
    res.send({msg:"base hi api endpoint"})
})

//register post/get for vendor

const  registerRouteU  = require("./routes/Register.user");
app.use("/register", registerRouteU);

const  Login  = require("./routes/Login.user");
app.use("/login", Login);

const port = process.env.PORT;
app.listen(port, async () => {
    try {
        await connection
        console.log('your db is now connected');
    } catch (error) {
        console.log(error);
    }
    console.log(`your app is running at ${port}`)
})