const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const validateVehicle = require("../middleware/vehicleValidation");

const {createVehicle,getAllVehicles,getVehicleById,updateVehicle,deleteVehicle} = require("../controllers/vehicleController");

router.post("/",authenticateUser,authorizeRoles("admin"),validateVehicle,createVehicle);
router.get("/",authenticateUser,getAllVehicles);
router.get("/:id",authenticateUser,getVehicleById);
router.put("/:id",authenticateUser,authorizeRoles("admin"),validateVehicle,updateVehicle);
router.delete("/:id",authenticateUser,authorizeRoles("admin"),deleteVehicle);

module.exports = router;