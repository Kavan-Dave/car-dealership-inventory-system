const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");

const createVehicle = async (req, res) => {

    try {

        const vehicle = await Vehicle.create(req.body);

        return res.status(201).json({
            message: "Vehicle created successfully",
            vehicle
        });

    } catch (error) {

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

const getAllVehicles = async (req, res) => {

    try {

        const vehicles = await Vehicle.find();

        return res.status(200).json({
            message: "Vehicles retrieved successfully",
            vehicles
        });

    } catch (error) {

        return res.status(500).json({
            message: "Database Error"
        });

    }
};

const getVehicleById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                message: "Invalid vehicle ID"
            });

        }

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {

            return res.status(404).json({
                message: "Vehicle not found"
            });

        }

        return res.status(200).json({
            message: "Vehicle retrieved successfully",
            vehicle
        });

    } catch (error) {

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

module.exports = {
    createVehicle,
    getAllVehicles,
    getVehicleById
};