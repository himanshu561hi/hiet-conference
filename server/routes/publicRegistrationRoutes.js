const express = require('express');
const router = express.Router();
const { publicRegister } = require('../controllers/publicRegistrationController');
const upload = require('../middlewares/uploadMiddleware');

// POST /api/v1/public/register
// Public endpoint — no auth token needed
router.post('/register', upload, publicRegister);

module.exports = router;
