const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  conferenceName: { type: String, default: 'NEXUS 2026' },
  registrationOpen: { type: Boolean, default: true },
  submissionDeadline: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // Default +30 days
  maxTeamSize: { type: Number, default: 4 },
  maxUploadSizeMB: { type: Number, default: 10 },
  emailEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
