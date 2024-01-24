
const nodemailer=require("nodemailer");
require("dotenv").config();


module.exports=async(email,subject,text)=>{
    try {
        const transporter=nodemailer.createTransport({
            host:process.env.HOST,
            service:process.env.SERVICE,
            post:Number(process.env.EMAIL_PORT),
            secure:Boolean(process.env.EMAIL_PORT),
            auth:{
                user:process.env.USER,
                pass:process.env.PASS,
            }
        })
        await transporter.sendMail({
            from:process.env.USER,
            to:email,
            subject:subject,
            text:text
        })
        console.log("send");
    } catch (error) {
        console.log("email not sent!");
		console.log(error);
		return error;
    }
}