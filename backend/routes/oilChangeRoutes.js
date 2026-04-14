const express = require('express');
const router = express.Router({mergeParams: true});
const authenticate = require('../middleware/auth');

const{
    getOilChangeLog,
    getOilChangeLogById,
    createOilChangeLog,
    updateOilChangeLog,
    deleteOilChangeLog
} = require('../controllers/oilChangeController');

router.get('/',authenticate,getOilChangeLog);
router.get('/:id',authenticate,getOilChangeLogById);
router.post('/',authenticate,createOilChangeLog);
router.put('/:id',authenticate,updateOilChangeLog);
router.delete('/:id',authenticate,deleteOilChangeLog);

module.exports = router;