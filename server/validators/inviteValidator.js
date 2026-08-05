const { z } = require('zod');

const sendInviteSchema = z.object({
  inviteeIdentifier: z.string().min(1, 'Please provide an Email or User ID to invite')
});

const validateSendInvite = (req, res, next) => {
  try {
    sendInviteSchema.parse(req.body);
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

module.exports = { validateSendInvite };
