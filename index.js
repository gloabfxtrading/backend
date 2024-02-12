
const mongoose = require("mongoose")
const express = require("express");
const { connection } = require('./config/db');

require("dotenv").config();
const fileUpload=require("express-fileupload");
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: '*'
}))
// app.use("/public/images",express.static("/public/images"))
// app.use((req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");

//   });
// app.use(express.json({limit:"50mb"}))
// app.use(express.urlencoded({extended:true,limit:"50mb"}))

app.get("/", (req, res) => {
    res.send({ msg: "base hi api endpoint" })
})
// app.use(fileUpload({
//     useTempFiles:true
// }))



//register post/get for vendor

const registerRouteU = require("./routes/Register.user");
app.use("/register", registerRouteU);

const Login = require("./routes/Login.user");
app.use("/login", Login);

const MakeaDeal = require("./routes/deal");
app.use("/makeadeal", MakeaDeal);


const ClosedDealRoute = require("./routes/closedDeal");
app.use("/close", ClosedDealRoute);

const AdminDeposit = require("./routes/adminDeposit");
app.use("/deposit", AdminDeposit);



const AdminRouteRegister = require("./routes/admin.Register");
app.use("/admin", AdminRouteRegister);


const AdminRouteLogin = require("./routes/admin.Login");
app.use("/adminlogin", AdminRouteLogin);


const UserGetRoute = require("./routes/user.getbalance");
app.use("/getbal", UserGetRoute);

const UpdateProfitRoute = require("./routes/updateProfit");
app.use("/update", UpdateProfitRoute);

const BankRoute = require("./routes/addBankdetails");
app.use("/bank", BankRoute);

const WithdrawRequestRoute = require("./routes/Withdraw");
app.use("/requestmoney", WithdrawRequestRoute);

const Checkmail = require("./routes/checkEmail");
app.use("/check", Checkmail);

const UserDepositRoute = require("./routes/User.deposit");
app.use("/file", UserDepositRoute);


const changePasswordRoutes = require("./routes/ChangePassword");
app.use("/changepassword", changePasswordRoutes);


const DocumentVerifyRoute = require("./routes/DocumentVerify");
app.use("/verify", DocumentVerifyRoute);

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