const User = require("../models/User");
const bcrypt = require("bcryptjs");
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
        const existingUser = await User.findOne({ email });
        // console.log("Existing User:", existingUser);
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
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
            error : "Database Error",
        });
    }
    

};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        return res.status(200).json({
            message: "Login successful"
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};