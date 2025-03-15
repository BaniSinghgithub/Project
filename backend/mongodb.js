const dotenv =require("dotenv").config(); // without config it will not work
const mongoose = require("mongoose");

// const MONGO_URL = "mongodb+srv://bani9717:banisingh@enquiryform.dg8rm.mongodb.net/EnquiryForm";

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("DB connected");
    }
  )
};

module.exports = connectDB;