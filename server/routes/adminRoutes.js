const express = require('express');
const router = express.Router();
const { getMetrics, getQueue, getRegistrationDetails } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Mount under /api/v1/admin
router.use(protect);
router.use(admin);

const { approveRegistration, rejectRegistration, requestCorrection, getReviewHistory, updateRegistrationStatus } = require('../controllers/adminReviewController');

router.get('/metrics', getMetrics);
router.get('/queue', getQueue);
router.get('/registration/:id', getRegistrationDetails);
router.post('/registration/:id/status', updateRegistrationStatus);

// Review Decision Endpoints
router.post('/review/approve', approveRegistration);
router.post('/review/reject', rejectRegistration);
router.post('/review/needs-correction', requestCorrection);
router.get('/review/history/:registrationId', getReviewHistory);

// Module 4 Controllers
const { getDashboardSummary } = require('../controllers/adminAnalyticsController');
const { getSettings, updateSettings } = require('../controllers/adminSettingsController');
const { bulkApprove, bulkExport } = require('../controllers/adminBulkController');

// Analytics & Reports
router.get('/dashboard/summary', getDashboardSummary);

// System Settings
router.route('/settings')
  .get(getSettings)
  .put(updateSettings);

// Bulk Operations
router.post('/bulk/approve', bulkApprove);
router.post('/bulk/export', bulkExport);

module.exports = router;
