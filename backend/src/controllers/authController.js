const User = require("../models/User");
console.log(User);
console.log(typeof User);
const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        console.log("Existing User:", existingUser);
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "User registered successfully"
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            error : error.message
        });
    }
    

};

module.exports = {
    registerUser
};