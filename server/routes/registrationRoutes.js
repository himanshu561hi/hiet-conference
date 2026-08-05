const express = require('express');
const router = express.Router();
const { getRegistrationMe, saveDetails, uploadPdf, finalSubmit, resubmit } = require('../controllers/registrationController');
const { validateSaveDetails } = require('../validators/registrationValidator');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/me', protect, getRegistrationMe);
router.put('/details', protect, validateSaveDetails, saveDetails);
router.post('/upload', protect, upload, uploadPdf);
router.post('/submit', protect, finalSubmit);
router.post('/resubmit', protect, resubmit);

module.exports = router;
