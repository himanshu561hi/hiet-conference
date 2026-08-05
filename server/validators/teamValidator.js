const { z } = require('zod');

const createTeamSchema = z.object({
  teamName: z.string().min(3, 'Team Name must be at least 3 characters').max(50, 'Team Name cannot exceed 50 characters'),
  teamType: z.enum(['Solo', 'Team'], {
    errorMap: () => ({ message: 'Team Type must be either Solo or Team' })
  })
});

const validateCreateTeam = (req, res, next) => {
  try {
    createTeamSchema.parse(req.body);
    next();
  } catch (error) {
    // Send standard error response for validation failures
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
      data: {},
      errors: error.errors,
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }
};

module.exports = { validateCreateTeam };
