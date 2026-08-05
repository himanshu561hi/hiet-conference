const { z } = require('zod');

const targetUserSchema = z.object({
  targetUserId: z.string().min(1, 'Target User ID is required')
});

const validateTargetUser = (req, res, next) => {
  try {
    targetUserSchema.parse(req.body);
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

module.exports = { validateTargetUser };
