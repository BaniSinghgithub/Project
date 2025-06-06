const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./mongodb");
const userRoutes = require("./userRoutes");
const otpRoutes = require("./Routes/OtpRoutes"); // ✅ consistent lowercase

require("dotenv").config();

connectDB();

const app = express();

app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/api", userRoutes);
app.use("/api/otp", otpRoutes); // ✅ fixed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;