const express = require('express');
const router = express.Router();
const authenticate= require('../middleware/auth');

const{
    getVehicles ,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');

router.get('/',authenticate,getVehicles);
router.get('/:id',authenticate,getVehicleById);
router.post('/',authenticate,createVehicle);
router.put('/:id',authenticate,updateVehicle);
router.delete('/:id',authenticate,deleteVehicle);

module.exports = router;
