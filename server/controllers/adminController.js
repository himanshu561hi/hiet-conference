const Registration = require('../models/Registration');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const mongoose = require('mongoose');

// @desc    Get dashboard metrics
// @route   GET /api/v1/admin/metrics
// @access  Private/Admin
exports.getMetrics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const metrics = await Registration.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          submittedToday: [
            { $match: { createdAt: { $gte: today }, status: 'Submitted' } },
            { $count: "count" }
          ],
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const result = metrics[0];
    const totalRegistrations = result.total[0]?.count || 0;
    const submittedToday = result.submittedToday[0]?.count || 0;
    
    const statusCounts = {
      Draft: 0,
      Submitted: 0,
      'Under Review': 0,
      'Needs Correction': 0,
      Approved: 0,
      Rejected: 0
    };

    result.byStatus.forEach(item => {
      if (item._id) statusCounts[item._id] = item.count;
    });

    return sendSuccess(res, 200, 'Metrics retrieved successfully', {
      totalRegistrations,
      submittedToday,
      statusCounts
    }, req);
  } catch (error) {
    return sendError(res, 500, 'ADM_006', 'Failed to fetch metrics', null, req);
  }
};

// @desc    Get paginated/filtered queue
// @route   GET /api/v1/admin/queue
// @access  Private/Admin
exports.getQueue = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, status, track, sort } = req.query;

    const pipeline = [];
    const matchStage = {};

    if (status && status !== 'All') {
      matchStage.status = status;
    }
    
    // We only want registrations that have actually been submitted at some point, or we show everything?
    // The spec says 'Submitted', 'Under Review', etc. Let's just exclude Drafts unless explicitly requested.
    if (!status || status === 'All') {
      matchStage.status = { $ne: 'Draft' };
    }

    if (track) {
      matchStage.conferenceTrack = track;
    }

    // Pipeline: First Match on root Registration fields
    pipeline.push({ $match: matchStage });

    // Lookup Team to get Team Name and Leader
    pipeline.push({
      $lookup: {
        from: 'teams',
        localField: 'team',
        foreignField: '_id',
        as: 'teamObj'
      }
    });
    pipeline.push({ $unwind: '$teamObj' });

    // Lookup Leader User
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'teamObj.leader',
        foreignField: '_id',
        as: 'leaderObj'
      }
    });
    pipeline.push({ $unwind: '$leaderObj' });

    // Search Logic (requires looking at populated fields)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      pipeline.push({
        $match: {
          $or: [
            { registrationNumber: searchRegex },
            { 'teamObj.teamName': searchRegex },
            { 'leaderObj.name': searchRegex },
            { 'leaderObj.email': searchRegex }
          ]
        }
      });
    }

    // Sort Logic
    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'registrationNumber') sortObj = { registrationNumber: 1 };
    
    pipeline.push({ $sort: sortObj });

    // Pagination
    pipeline.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: limit }]
      }
    });

    const result = await Registration.aggregate(pipeline);
    
    const totalDocs = result[0].metadata[0]?.total || 0;
    const totalPages = Math.ceil(totalDocs / limit);
    const docs = result[0].data.map(doc => ({
      _id: doc._id,
      registrationNumber: doc.registrationNumber,
      teamId: doc.teamObj.teamId, // custom readable id
      teamName: doc.teamObj.teamName,
      leaderName: doc.leaderObj.name,
      leaderEmail: doc.leaderObj.email,
      conferenceTrack: doc.conferenceTrack,
      status: doc.status,
      createdAt: doc.createdAt
    }));

    return sendSuccess(res, 200, 'Queue retrieved successfully', {
      docs,
      page,
      limit,
      totalPages,
      totalDocs
    }, req);

  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'ADM_006', 'Failed to fetch queue', null, req);
  }
};

// @desc    Get detailed registration info for review
// @route   GET /api/v1/admin/registration/:id
// @access  Private/Admin
exports.getRegistrationDetails = async (req, res) => {
  try {
    const AuditLog = require('../models/AuditLog'); // Pull in AuditLog inline or at top
    const registrationId = req.params.id;

    const registration = await Registration.findById(registrationId)
      .populate({
        path: 'team',
        populate: [
          { path: 'leader', select: 'name email profile' },
          { path: 'members.user', select: 'name email profile' }
        ]
      })
      .populate('authors.user', 'name email profile');

    if (!registration) {
      return sendError(res, 404, 'ADM_002', 'Registration Not Found', null, req);
    }

    // Fetch the raw audit logs tied to this team's ID
    const auditLogs = await AuditLog.find({ targetId: registration.team._id.toString() })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Registration retrieved successfully', {
      registration,
      auditLogs
    }, req);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'ADM_006', 'Failed to fetch registration details', null, req);
  }
};
