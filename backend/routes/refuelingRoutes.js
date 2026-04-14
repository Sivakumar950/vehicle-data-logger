const express  = require('express');
const router = express.Router({mergeParams: true});
const authenticate = require('../middleware/auth');

const{
    getRefuelingLog,
    getRefuelingLogById,
    createRefuelingLog,
    updateRefuelingLog,
    deleteRefuelingLog
} = require('../controllers/refuelingController');

router.get('/',authenticate, getRefuelingLog);
router.get('/:id',authenticate, getRefuelingLogById);
router.post('/',authenticate, createRefuelingLog);
router.put('/:id',authenticate, updateRefuelingLog);
router.delete('/:id',authenticate, deleteRefuelingLog);

module.exports = router;