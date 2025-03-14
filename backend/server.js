const express = require("express");
const cors = require("cors");
const connectDB = require("./mongodb");
const userRoutes = require("./userRoutes");
const dotenv = require("dotenv");

dotenv.config();

connectDB();

const app = express();   // to make it executable
// app.use(cors);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use("/api/userRoutes", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports= app;