const cloudinary = require("cloudinary").v2;
const express = require("express");
const DocumentVerifyRoute = express.Router();
const multer = require("multer");
const { userModel } = require("../models/UserModel");
const DocumentModel = require("../models/Document.Model");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage })

DocumentVerifyRoute.post('/addDetail/:id', async (req, res) => {
  const { document, Image } = req.body;
  let user = await userModel.findOne({ AcNumber: req.params.id })
  console.log(user)
  console.log(user.AcNumber)
  const newItem = new DocumentModel({

    AcNumber: user.AcNumber,
    document, Image
  })
  try {

    await newItem.save();
    res.send({ msg: 'added successfully....', newItem })
  } catch (err) {
    console.log(err)
    res.send({ msg: 'Error unable to upload product' })
  }
})

DocumentVerifyRoute.post('/upload', upload.single('Image'), async (req, res) => {
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

module.exports=DocumentVerifyRoute