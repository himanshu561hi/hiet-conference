const SystemSettings = require('../models/SystemSettings');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

// Helper to ensure singleton exists
const getOrCreateSettings = async () => {
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create({});
  }
  return settings;
};

// @desc    Get system settings
// @route   GET /api/v1/admin/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    return sendSuccess(res, 200, 'Settings retrieved', { settings }, req);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'ADM_015', 'Failed to retrieve settings', null, req);
  }
};

// @desc    Update system settings
// @route   PUT /api/v1/admin/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    
    // Whitelist editable fields
    const {
      conferenceName,
      registrationOpen,
      submissionDeadline,
      maxTeamSize,
      maxUploadSizeMB,
      emailEnabled,
      maintenanceMode
    } = req.body;

    if (conferenceName !== undefined) settings.conferenceName = conferenceName;
    if (registrationOpen !== undefined) settings.registrationOpen = registrationOpen;
    if (submissionDeadline !== undefined) settings.submissionDeadline = submissionDeadline;
    if (maxTeamSize !== undefined) settings.maxTeamSize = maxTeamSize;
    if (maxUploadSizeMB !== undefined) settings.maxUploadSizeMB = maxUploadSizeMB;
    if (emailEnabled !== undefined) settings.emailEnabled = emailEnabled;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;

    await settings.save();

    return sendSuccess(res, 200, 'Settings updated successfully', { settings }, req);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'ADM_016', 'Failed to update settings', null, req);
  }
};
