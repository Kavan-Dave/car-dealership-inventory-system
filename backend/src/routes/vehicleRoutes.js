const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const validateVehicle = require("../middleware/vehicleValidation");

const {createVehicle,getAllVehicles} = require("../controllers/vehicleController");

router.post("/",authenticateUser,authorizeRoles("admin"),validateVehicle,createVehicle);
router.get("/",authenticateUser,getAllVehicles);

module.exports = router;