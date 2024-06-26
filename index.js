
const mongoose = require("mongoose")
const express = require("express");
const { connection } = require('./config/db');

require("dotenv").config();
const fileUpload=require("express-fileupload");
const app = express();
app.use(express.json());
const cookie=require("cookie-parser")


const cors = require('cors');
app.use(cors({
  origin: '*',
}));



app.get("/", (req, res) => {
    res.send({ msg: "base hi api endpoint" })
})
// app.use(fileUpload({
//     useTempFiles:true
// }))

app.use(cookie());



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

const registerRouteDemo = require("./routes/demoRegister");
app.use("/registerdemo", registerRouteDemo);

const UserDepositRoute = require("./routes/User.deposit");
app.use("/file", UserDepositRoute);


const changePasswordRoutes = require("./routes/ChangePassword");
app.use("/changepassword", changePasswordRoutes);


const DocumentVerifyRoute = require("./routes/DocumentVerify");
app.use("/verify", DocumentVerifyRoute);

const ClosedDealRouteDemo = require("./routes/closeddealdemo");
app.use("/closedemo", ClosedDealRouteDemo);

const dealRouteDemo = require("./routes/dealdemo");
app.use("/makeadealdemo", dealRouteDemo);

const WithdrawRequestOtherRoute=require("./routes/Withdrawother");
app.use("/otherwithdraw",WithdrawRequestOtherRoute);


const ForgetPass = require("./routes/forgetPassword");
const { userModel } = require("./models/UserModel");
const cookieParser = require("cookie-parser");
app.use("/forget", ForgetPass);

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