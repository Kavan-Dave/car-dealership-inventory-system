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

const updateVehicle = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                message: "Invalid vehicle ID"
            });

        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedVehicle) {

            return res.status(404).json({
                message: "Vehicle not found"
            });

        }

        return res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle
        });

    } catch (error) {

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

const deleteVehicle = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                message: "Invalid vehicle ID"
            });

        }

        const deletedVehicle = await Vehicle.findByIdAndDelete(id);

        if (!deletedVehicle) {

            return res.status(404).json({
                message: "Vehicle not found"
            });

        }

        return res.status(200).json({
            message: "Vehicle deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

const searchVehicles = async (req, res) => {
    try {

        const {
            make,
            model,
            category,
            minPrice,
            maxPrice
        } = req.query;

        const query = {};

        if (make) {
            query.make = {
                $regex: make,
                $options: "i"
            };
        }

        if (model) {
            query.model = {
                $regex: model,
                $options: "i"
            };
        }

        if (category) {
            query.category = {
                $regex: category,
                $options: "i"
            };
        }

        if (minPrice || maxPrice) {

            query.price = {};

            if (minPrice) {
                query.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                query.price.$lte = Number(maxPrice);
            }
        }

        const vehicles = await Vehicle.find(query);

        return res.status(200).json({
            message: "Vehicles retrieved successfully",
            vehicles
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    searchVehicles
};