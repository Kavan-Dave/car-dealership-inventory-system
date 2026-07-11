const validateVehicle = (req, res, next) => {

    const {
        make,
        model,
        year,
        price,
        mileage,
        color,
        fuelType,
        transmission
    } = req.body;

    if (
        !make ||
        !model ||
        !year ||
        price === undefined ||
        mileage === undefined ||
        !color ||
        !fuelType ||
        !transmission
    ) {
        return res.status(400).json({
            message: "All vehicle fields are required"
        });
    }

    const validFuelTypes = [
        "Petrol",
        "Diesel",
        "Electric",
        "Hybrid"
    ];

    if (!validFuelTypes.includes(fuelType)) {
        return res.status(400).json({
            message: "Invalid fuel type"
        });
    }

    const validTransmission = [
        "Manual",
        "Automatic"
    ];

    if (!validTransmission.includes(transmission)) {
        return res.status(400).json({
            message: "Invalid transmission type"
        });
    }

    if (price < 0) {
        return res.status(400).json({
            message: "Price cannot be negative"
        });
    }

    if (mileage < 0) {
        return res.status(400).json({
            message: "Mileage cannot be negative"
        });
    }

    next();

};

module.exports = validateVehicle;