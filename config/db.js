const mongoose = require('mongoose') ;
require('dotenv').config() ;

const connection = mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000, // Adjust the timeout value as needed
})

module.exports={
    connection
}
