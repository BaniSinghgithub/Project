const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://bani9717:banisingh@enquiryform.dg8rm.mongodb.net/EnquiryForm";

const connectDB = async () => {
  await mongoose
    .connect(MONGO_URI)
    .then((errr) => {
      console.log("DB connected");
    })
};

module.exports = connectDB;
