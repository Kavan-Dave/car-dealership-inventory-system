const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const validateVehicle = require("../middleware/vehicleValidation");

const {
    createVehicle
} = require("../controllers/vehicleController");

router.post("/",authenticateUser,authorizeRoles("admin"),validateVehicle,createVehicle);

module.exports = router;