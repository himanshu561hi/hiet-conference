const { z } = require('zod');
const { formatZodError, sendError } = require('../utils/responseHelpers');

const saveDetailsSchema = z.object({
  paperCategory: z.string().optional(),
  researchDomain: z.string().optional(),
  presentationPreference: z.string().optional(),
  specialRequirements: z.string().optional(),
  additionalRemarks: z.string().optional(),
  
  // Phase 10.2 Fields
  title: z.string().max(120, 'Title cannot exceed 120 characters').optional(),
  abstract: z.string().refine((val) => {
    if (!val) return true;
    return val.split(/\s+/).length <= 300;
  }, 'Abstract cannot exceed 300 words').optional(),
  keywords: z.array(z.string()).max(7, 'Maximum 7 keywords allowed').optional(),
  conferenceTrack: z.string().optional(),
  language: z.enum(['English', '']).optional()
});

exports.validateSaveDetails = (req, res, next) => {
  try {
    req.body = saveDetailsSchema.parse(req.body);
    next();
  } catch (error) {
    const formattedErrors = formatZodError(error);
    return sendError(res, 400, 'SYS_400', 'Validation Error', formattedErrors, req);
  }
};
