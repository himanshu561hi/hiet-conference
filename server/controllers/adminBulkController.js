const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Team = require('../models/Team');
const Review = require('../models/Review');
const AuditLog = require('../models/AuditLog');
const NotificationService = require('../services/NotificationService');
const ReportService = require('../services/ReportService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

const checkIsReplicaSet = () => process.env.NODE_ENV !== 'test' && mongoose.connection.client?.topology?.s?.description?.type !== 'Single';

// @desc    Bulk Approve Registrations
// @route   POST /api/v1/admin/bulk/approve
// @access  Private/Admin
exports.bulkApprove = async (req, res) => {
  const { registrationIds } = req.body;
  if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
    return sendError(res, 400, 'ADM_017', 'Array of registrationIds required', null, req);
  }

  let session = null;
  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    const registrations = await Registration.find({ _id: { $in: registrationIds }, status: { $ne: 'Approved' } }).populate('team').session(session);
    
    let processed = 0;
    for (const reg of registrations) {
      const team = reg.team;
      if (!team) continue;

      reg.status = 'Approved';
      await reg.save({ session });

      team.status = 'Approved';
      team.isLocked = true;
      await team.save({ session });

      // Create Review
      const round = (await Review.countDocuments({ registrationId: reg._id }).session(session)) + 1;
      await Review.create([{
        registrationId: reg._id,
        reviewRound: round,
        reviewerId: req.user._id,
        action: 'Approved',
        status: 'Historical',
        internalNotes: 'Bulk Approved'
      }], { session });

      await AuditLog.create([{
        user: req.user._id,
        action: 'REGISTRATION_APPROVED_BULK',
        targetId: team._id.toString()
      }], { session });

      processed++;
    }

    if (session) await session.commitTransaction();
    return sendSuccess(res, 200, `Bulk approval complete. Processed ${processed} items.`, { processed }, req);

  } catch (error) {
    if (session) await session.abortTransaction();
    console.error(error);
    return sendError(res, 500, 'ADM_018', 'Bulk approve failed', null, req);
  } finally {
    if (session) session.endSession();
  }
};

// @desc    Bulk Export
// @route   POST /api/v1/admin/bulk/export
// @access  Private/Admin
exports.bulkExport = async (req, res) => {
  const { filter, format } = req.body;
  // filter can be {} for all, or { _id: { $in: [...] } } for selected rows
  
  try {
    const registrations = await Registration.find(filter || {})
      .populate('team', 'teamName teamId teamType joinCode')
      .populate({
        path: 'team',
        populate: { path: 'leader', select: 'name email' }
      })
      .lean();

    const data = registrations.map(r => ({
      'Registration No': r.registrationNumber,
      'Team Name': r.team?.teamName || 'N/A',
      'Team ID': r.team?.teamId || 'N/A',
      'Leader Name': r.team?.leader?.name || 'N/A',
      'Leader Email': r.team?.leader?.email || 'N/A',
      'Status': r.status,
      'Track': r.conferenceTrack || 'N/A',
      'Submitted Date': new Date(r.createdAt).toLocaleString()
    }));

    if (format === 'CSV') {
      const fields = ['Registration No', 'Team Name', 'Team ID', 'Leader Name', 'Leader Email', 'Status', 'Track', 'Submitted Date'];
      const buffer = ReportService.generateCSV(data, fields);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=Registrations_Export.csv');
      return res.send(buffer);
    } 
    else if (format === 'Excel') {
      const columns = [
        { header: 'Registration No', key: 'Registration No', width: 25 },
        { header: 'Team Name', key: 'Team Name', width: 25 },
        { header: 'Team ID', key: 'Team ID', width: 20 },
        { header: 'Leader Name', key: 'Leader Name', width: 25 },
        { header: 'Leader Email', key: 'Leader Email', width: 30 },
        { header: 'Status', key: 'Status', width: 15 },
        { header: 'Track', key: 'Track', width: 25 },
        { header: 'Submitted Date', key: 'Submitted Date', width: 25 }
      ];
      const buffer = await ReportService.generateExcel(data, columns, 'Registrations');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Registrations_Export.xlsx');
      return res.send(buffer);
    }
    else if (format === 'PDF') {
      const columns = ['Registration No', 'Team Name', 'Status', 'Track'];
      const buffer = await ReportService.generatePDF(data, columns, 'Registration Export Report');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Registrations_Export.pdf');
      return res.send(buffer);
    } 
    else {
      return sendError(res, 400, 'ADM_019', 'Invalid format requested', null, req);
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'ADM_020', 'Export failed', null, req);
  }
};
