const mongoose = require("mongoose");

/**
 * Vehicle schema representing cars in the dealership inventory.
 * Enforces strong validation, data sanitization (trimming), and constraints to maintain
 * data consistency and facilitate accurate search queries.
 */
const vehicleSchema = new mongoose.Schema(
    {
        make: {
            type: String,
            required: true,
            trim: true // Prevents trailing or leading spaces which can break case-insensitive regex search matches
        },

        model: {
            type: String,
            required: true,
            trim: true // Clean whitespace to ensure consistency in listing and matching
        },

        year: {
            type: Number,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0 // Price must be non-negative
        },

        mileage: {
            type: Number,
            required: true,
            min: 0 // Mileage must be non-negative
        },

        color: {
            type: String,
            required: true,
            trim: true
        },

        fuelType: {
            type: String,
            enum: ["Petrol", "Diesel", "Electric", "Hybrid"], // Limit choices to supported fuel types
            required: true
        },

        transmission: {
            type: String,
            enum: ["Manual", "Automatic"], // Restrict choices to ensure standard inventory classifications
            required: true
        },

        status: {
            type: String,
            enum: ["Available", "Reserved", "Sold"],
            default: "Available" // Default availability state for newly input inventory
        },
        category: {
            type: String,
            required: true,
            trim: true // Used for filtering and categorization (e.g. Sedan, SUV)
        },

        quantity: {
            type: Number,
            required: true,
            min: 0, // Quantity cannot fall below zero (sold out state)
            default: 0
        }
    },
    {
        // Tracks creation and modification times to show recently updated or added listings on the frontend
        timestamps: true
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);