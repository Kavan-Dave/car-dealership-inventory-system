const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// console.log(User);
// console.log(typeof User);
const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }
        const existingUser = await User.findOne({ email });
        // console.log("Existing User:", existingUser);
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password : hashedPassword
        });
        res.status(201).json({
            message: "User registered successfully"
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            message : "Database Error",
        });
    }
    

};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const getProfile = async (req, res) => {

    return res.status(200).json({
        message: "Profile retrieved successfully",
        user: req.user
    });

};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};