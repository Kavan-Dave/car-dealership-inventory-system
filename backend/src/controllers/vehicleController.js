const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");

/**
 * Creates a new vehicle record in the inventory database.
 * Accessible only by administrators. Receives pre-validated vehicle parameters from the request body.
 */
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

/**
 * Retrieves all vehicle records from the database.
 * Used to populate the main dashboard inventory catalog.
 */
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

/**
 * Retrieves a single vehicle record by its unique database ID.
 * Validates ObjectId structure before querying Mongoose to prevent casting failures.
 */
const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent Mongoose cast errors by pre-validating ObjectId structure
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

/**
 * Updates an existing vehicle's attributes in the database.
 * Accessible only by administrators. Applies strict validations on update parameters.
 */
const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid vehicle ID"
            });
        }

        // new: true returns the updated document; runValidators enforces schema validation rules on the update block
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

/**
 * Deletes a vehicle record from the database by ID.
 * Admin-restricted operation.
 */
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

/**
 * Filters and searches vehicle records based on optional query parameters:
 * make, model, category, minPrice, and maxPrice.
 * Text fields use case-insensitive, partial matching for fuzzy searches.
 */
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

        // Apply case-insensitive ('i') partial regex queries to enable fuzzy filtering
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

        // Dynamically append range queries for numerical attributes
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

/**
 * Executes a purchase operation for a specific vehicle.
 * Decrements the stock quantity by 1.
 * If quantity drops to 0, automatically flips the status to "Sold".
 * Returns a 400 Bad Request if the inventory quantity is already 0.
 */
const purchaseVehicle = async (req, res) => {
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

        // Prevent transaction execution if the car is out of stock
        if (vehicle.quantity === 0) {
            return res.status(400).json({
                message: "Vehicle is out of stock"
            });
        }

        vehicle.quantity -= 1;

        // Auto-update availability state if no inventory remains
        if (vehicle.quantity === 0) {
            vehicle.status = "Sold";
        }

        await vehicle.save();

        return res.status(200).json({
            message: "Vehicle purchased successfully",
            vehicle
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/**
 * Restocks a vehicle's inventory quantity by 1.
 * Accessible only by administrators.
 * Automatically updates status back to "Available" when stock is added.
 */
const restockVehicle = async (req, res) => {
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

        // Increment count and force status back to Available since quantity is positive
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            id,
            {
                quantity: vehicle.quantity + 1,
                status: "Available"
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Vehicle restocked successfully",
            vehicle: updatedVehicle
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
    searchVehicles,
    purchaseVehicle,
    restockVehicle
};