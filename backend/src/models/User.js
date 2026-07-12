const mongoose = require("mongoose");

/**
 * User schema definition representing either a Salesperson or Admin.
 * Default role is restricted to 'salesperson' to ensure secure-by-default access control,
 * preventing accidental privilege escalation during new user registrations.
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Enforces unique account registration per email
        },
        password: {
            type: String,
            required: true, // Stored as a secure salted bcrypt hash
        },
        role: {
            type: String,
            enum: ["admin", "salesperson"],
            default: "salesperson" // Default role is low-privilege salesperson
        },
    },
    {
        // Automatically injects createdAt and updatedAt fields for record auditing
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);