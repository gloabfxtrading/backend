
const mongoose = require("mongoose")
const express = require("express");
const { connection } = require('./config/db');

require("dotenv").config();
const fileUpload=require("express-fileupload");
const app = express();
app.use(express.json());
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


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
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Assuming you use email as the username
    async (email, password, done) => {
      try {
        // Implement your logic to find and validate the user
        const user = await userModel.findOne({ email });
  
        if (!user) {
          return done(null, false, { message: 'Incorrect email' });
        }
  
        const isMatch = await user.comparePassword(password);
  
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
  
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
  
  app.use(passport.initialize());

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


const ForgetPass = require("./routes/forgetPassword");
const { userModel } = require("./models/UserModel");
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