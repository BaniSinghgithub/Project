// const dotenv =require("dotenv").config(); // without config it will not work
// const mongoose = require("mongoose");

// const MONGO_URL = "mongodb+srv://bani9717:banisingh@enquiryform.dg8rm.mongodb.net/EnquiryForm";
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Kill app on DB connection failure
  }
};

module.exports = connectDB;
