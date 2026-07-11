const express = require("express");

const app = express();

app.use(express.json());

module.exports = app;

app.post("/api/auth/register", (req, res) => {
    res.status(201).json({ message: "User registered successfully" });
});