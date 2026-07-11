const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    createVehicle
} = require("../controllers/vehicleController");

router.post(
    "/",
    authenticateUser,
    authorizeRoles("admin"),
    createVehicle
);

module.exports = router;