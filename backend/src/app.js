const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
const vehicleRoutes = require("./routes/vehicleRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

module.exports = app;
