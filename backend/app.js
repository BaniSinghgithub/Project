const express = require("express");
const cors = require("cors");
const connectDB = require("./mongodb");
const userRoutes = require("./userRoutes");
const dotenv = require("dotenv").config();  // to access environmental variables from .env file

connectDB();

const app = express();   // to make it executable
// app.use(cors);
app.use(cors({ origin: "https://project-nhyt.vercel.app/", credentials: true }));

app.use(express.json());
app.use("/api/userRoutes", userRoutes);


// console.log(process.env.PORT);  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports= app;
