const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const validateVehicle = require("../middleware/vehicleValidation");

const {createVehicle,getAllVehicles,getVehicleById,updateVehicle,deleteVehicle,searchVehicles,purchaseVehicle,restockVehicle} = require("../controllers/vehicleController");

router.post("/",authenticateUser,authorizeRoles("admin"),validateVehicle,createVehicle);
router.get("/",authenticateUser,getAllVehicles);
router.get("/search",authenticateUser,searchVehicles);
router.post("/:id/purchase",authenticateUser,purchaseVehicle);
router.post("/:id/restock",authenticateUser,authorizeRoles("admin"),restockVehicle);
router.get("/:id",authenticateUser,getVehicleById);
router.put("/:id",authenticateUser,authorizeRoles("admin", "salesperson"),validateVehicle,updateVehicle);
router.delete("/:id",authenticateUser,authorizeRoles("admin"),deleteVehicle);

module.exports = router;