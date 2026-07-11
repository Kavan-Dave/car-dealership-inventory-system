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

module.exports = {
    createVehicle
};