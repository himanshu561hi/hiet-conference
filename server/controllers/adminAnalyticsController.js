const Registration = require('../models/Registration');
const AuditLog = require('../models/AuditLog');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

// @desc    Get comprehensive dashboard summary
// @route   GET /api/v1/admin/dashboard/summary
// @access  Private/Admin
exports.getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Unified Aggregation for Registration Metrics
    const metricsPipeline = await Registration.aggregate([
      {
        $lookup: {
          from: 'teams',
          localField: 'team',
          foreignField: '_id',
          as: 'teamData'
        }
      },
      { $unwind: { path: '$teamData', preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          total: [{ $count: "count" }],
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          submittedToday: [
            { $match: { createdAt: { $gte: today }, status: 'Submitted' } },
            { $count: "count" }
          ],
          byTrack: [
            { $group: { _id: "$conferenceTrack", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }
          ],
          byTeamType: [
            { $group: { _id: "$teamData.teamType", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }
          ],
          byCategory: [
            { $group: { _id: "$paperCategory", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }
          ],
          registrationsPerDay: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
          ]
        }
      }
    ]);

    const result = metricsPipeline[0];

    // Format metrics
    const totalRegistrations = result.total[0]?.count || 0;
    const submittedToday = result.submittedToday[0]?.count || 0;
    
    const statuses = { Draft: 0, Submitted: 0, 'Under Review': 0, 'Needs Correction': 0, Approved: 0, Rejected: 0 };
    result.statusCounts.forEach(item => { if (item._id) statuses[item._id] = item.count; });

    // Format Charts
    const charts = {
      registrationsPerDay: result.registrationsPerDay.map(i => ({ date: i._id, count: i.count })),
      byTrack: result.byTrack.map(i => ({ name: i._id, value: i.count })),
      byTeamType: result.byTeamType.map(i => ({ name: i._id, value: i.count })),
      byCategory: result.byCategory.map(i => ({ name: i._id, value: i.count }))
    };

    // 2. Fetch Latest Activity (Audit Logs)
    const recentActivity = await AuditLog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    return sendSuccess(res, 200, 'Dashboard summary retrieved', {
      metrics: {
        totalRegistrations,
        submittedToday,
        pendingReview: statuses['Submitted'] + statuses['Under Review'],
        approved: statuses['Approved'],
        rejected: statuses['Rejected'],
        needsCorrection: statuses['Needs Correction']
      },
      charts,
      recentActivity
    }, req);

  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'ADM_014', 'Failed to generate dashboard summary', null, req);
  }
};
