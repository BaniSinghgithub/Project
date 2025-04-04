const express = require("express");
const cors = require("cors");
const connectDB = require("./mongodb");
const userRoutes = require("./userRoutes");
require("dotenv").config();  // to access environmental variables from .env file

connectDB();

const app = express();   // to make it executable
app.use(express.json());

// const corsOptions = {
//   origin: ["http://localhost:3000", "https://project-nhyt-ag4s0vn44-bani-singhs-projects.vercel.app"],
//   credentials: true,
// };


// app.use(cors(corsOptions));

// Add all allowed frontend origins here:
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://project-nhyt.vercel.app",  // ✅ your deployed frontend
     "https://project-nhyt-ag4s0vn44-bani-singhs-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));


app.use("/api", userRoutes);

// console.log(process.env.PORT);  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports= app;
