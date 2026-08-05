const { z } = require('zod');

const sendRequestSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  joinCode: z.string().length(6, 'Join Code must be exactly 6 characters')
});

const validateSendRequest = (req, res, next) => {
  try {
    sendRequestSchema.parse(req.body);
    next();
  } catch (error) {
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

module.exports = { validateSendRequest };
