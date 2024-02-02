
const mongoose=require("mongoose")
const express = require("express");
const { connection } = require('./config/db');

require("dotenv").config();
const app = express();
app.use(express.json());

const cors = require('cors') ;
app.use(cors({
    origin:'*'
}))

app.get("/", (req, res) => {
    res.send({msg:"base hi api endpoint"})
})

//register post/get for vendor

const  registerRouteU  = require("./routes/Register.user");
app.use("/register", registerRouteU);

const  Login  = require("./routes/Login.user");
app.use("/login", Login);

const  MakeaDeal  = require("./routes/deal");
app.use("/makeadeal", MakeaDeal);


const  ClosedDealRoute  = require("./routes/closedDeal");
app.use("/close", ClosedDealRoute);

const  AdminDeposit  = require("./routes/adminDeposit");
app.use("/deposit", AdminDeposit);



const  AdminRouteRegister  = require("./routes/admin.Register");
app.use("/admin", AdminRouteRegister);


const  AdminRouteLogin  = require("./routes/admin.Login");
app.use("/adminlogin", AdminRouteLogin);


const  UserGetRoute  = require("./routes/user.getbalance");
app.use("/getbal", UserGetRoute);

const  UpdateProfitRoute  = require("./routes/updateProfit");
app.use("/update", UpdateProfitRoute);

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