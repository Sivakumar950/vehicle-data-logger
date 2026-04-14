const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const authenticate = require('../middleware/auth');
const {
  getServiceNote,
  getServiceNoteById,
  createServiceNote,
  updateServiceNote,
  deleteServiceNote,
} = require('../controllers/serviceNoteController');

const upload = multer({ storage: multer.memoryStorage() });
router.get('/', authenticate, getServiceNote);
router.get('/:id', authenticate, getServiceNoteById);
router.post('/', authenticate, upload.single('bill_image'), createServiceNote);
router.put('/:id', authenticate, upload.single('bill_image'), updateServiceNote);
router.delete('/:id', authenticate, deleteServiceNote);
module.exports = router;