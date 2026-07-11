const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        make: {
            type: String,
            required: true,
            trim: true
        },

        model: {
            type: String,
            required: true,
            trim: true
        },

        year: {
            type: Number,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        mileage: {
            type: Number,
            required: true,
            min: 0
        },

        color: {
            type: String,
            required: true,
            trim: true
        },

        fuelType: {
            type: String,
            enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
            required: true
        },

        transmission: {
            type: String,
            enum: ["Manual", "Automatic"],
            required: true
        },

        status: {
            type: String,
            enum: ["Available", "Reserved", "Sold"],
            default: "Available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);