const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Handles registration of new users.
 * Validates request payload structures, validates email formats, checks for duplicate accounts,
 * hashes passwords securely to protect credentials at rest, and defaults users to the low-privilege 'salesperson' role.
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Ensure all required fields are filled out
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        // Match email format using standard RFC regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }
        
        // Ensure email uniqueness to prevent registration duplicates
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        
        // Hash passwords with 10 salt rounds to defend against rainbow table and brute-force attacks
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        });
        
        res.status(201).json({
            message: "User registered successfully"
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            message: "Database Error",
        });
    }
};

/**
 * Authenticates user credentials.
 * Checks the database for the user email, compares the password against the stored bcrypt hash,
 * and signs a JWT containing the user identity (userId) and access permissions (role).
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check input presence immediately to avoid redundant database lookups
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
        
        // Fetch user from DB; return generic error if not found to prevent username enumeration exploits
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        
        // Securely compare input password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        
        // Sign the JSON Web Token containing the minimum needed identity claims for authorisation
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d" // Expire in 1 day to balance UX convenience and session freshness
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

/**
 * Retrieves the current user's security profile.
 * Extracts the user claims attached to the request object by the authentication middleware (authMiddleware).
 */
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