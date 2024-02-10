const cloudinary = require("cloudinary").v2;
const express = require("express");
const UserDepositRoute = express.Router();
const multer = require("multer");
const { userModel } = require("../models/UserModel");
const UserDepositModel = require("../models/User.Deposit.model");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage })

UserDepositRoute.post('/addDetail/:id', async (req, res) => {
  const { code, amount, Image } = req.body;
  let user = await UserDepositModel.find({ AcNumber: req.params.id })
  const newItem = new UserDepositModel({

    AcNumber: user.AcNumber,
    code, amount, Image
  })
  try {
    await newItem.save();
    res.send({ msg: 'added successfully....' })
  } catch (err) {
    console.log(err)
    res.send({msg:'Error unable to upload product'})
  }
})

UserDepositRoute.post('/upload', upload.single('Image'), async (req, res) => {
  try {
    console.log(req.file.buffer);
    const fileBuffer = req.file.buffer;
    //cloudinary upload process
    // ---------- unique public id creation ---------
    const timestamp = new Date().getTime();
    const uniqueId = Math.floor(Math.random() * 100000);
    const publicId = `image_${timestamp}_${uniqueId}`;

    cloudinary.uploader.upload_stream({
      public_id: publicId,  // This public_id should be unique each time so that the old image don't get replace with new one in cloudinary media library.
    },
      (err, result) => {
        if (err) throw err;
        console.log(result);
        return res.status(201).send({ message: "File uploaded successfully", url: result.url });
      })
      .end(fileBuffer);
  } catch (error) {
    res.json({ message: "Error: " + error.message });
  }
});



UserDepositRoute.get("/", async (req, res) => {
  try {
    let deposit = await UserDepositModel.find()
  } catch (error) {

  }
})
module.exports = UserDepositRoute;
