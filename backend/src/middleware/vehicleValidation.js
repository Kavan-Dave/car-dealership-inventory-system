/**
 * Request body validator middleware for vehicle creation and update operations.
 * Validates presence of mandatory properties, sanitizes input formats, and enforces business
 * rules such as non-negative numeric constraints for price and mileage.
 */
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

    // Checks presence of all required fields. Explicitly matches price/mileage against undefined
    // because a price of 0 or mileage of 0 are falsy in JS but logically valid numbers.
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

    // Restrict fuel type selection to options allowed by the data model
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

    // Restrict transmission options to standard types to maintain inventory purity
    const validTransmission = [
        "Manual",
        "Automatic"
    ];

    if (!validTransmission.includes(transmission)) {
        return res.status(400).json({
            message: "Invalid transmission type"
        });
    }

    // Business rule: Financial transaction fields cannot record negative values
    if (price < 0) {
        return res.status(400).json({
            message: "Price cannot be negative"
        });
    }

    // Business rule: Mechanical metrics cannot represent negative values
    if (mileage < 0) {
        return res.status(400).json({
            message: "Mileage cannot be negative"
        });
    }

    next();
};

module.exports = validateVehicle;