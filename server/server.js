const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Student Registration Portal Server Running!");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});