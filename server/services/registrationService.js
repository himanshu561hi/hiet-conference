const Registration = require('../models/Registration');
const Team = require('../models/Team');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

const checkIsReplicaSet = () => process.env.NODE_ENV !== 'test' && mongoose.connection.client?.topology?.s?.description?.type !== 'Single';

class RegistrationService {
  /**
   * Fetches the current active draft for a team.
   * If it doesn't exist, initializes a Version 1 draft.
   */
  async getDraft(teamId) {
    let registration = await Registration.findOne({ team: teamId });
    if (!registration) {
      registration = await Registration.create({ team: teamId, version: 1, status: 'Draft' });
      
      // Initial Audit Log
      await new AuditLog({
        user: null, // System generated or handle gracefully
        action: 'DRAFT_CREATED',
        targetId: teamId.toString()
      }).save();
    }
    return registration;
  }

  /**
   * Saves partial or full details to the draft and increments version.
   * Creates an audit log for the timeline.
   */
  async saveDetails(teamId, userId, payload) {
    let session = null;
    if (checkIsReplicaSet()) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    try {
      const registration = await Registration.findOne({ team: teamId }).session(session);
      if (!registration) {
        const err = new Error('Draft not found'); err.code = 'REG_001'; err.statusCode = 404; throw err;
      }

      // Check Lock Rules (REG_002)
      const lockedStatuses = ['Submitted', 'Approved', 'Rejected', 'Locked'];
      if (lockedStatuses.includes(registration.status)) {
        const err = new Error('Registration is locked.'); err.code = 'REG_002'; err.statusCode = 403; throw err;
      }

      // Update fields
      const allowedFields = ['paperCategory', 'researchDomain', 'presentationPreference', 'specialRequirements', 'additionalRemarks', 'title', 'abstract', 'theme', 'keywords', 'conferenceTrack', 'language', 'authors'];
      
      let hasChanges = false;
      const logsToEmit = [];

      // Manual Delta Checks for Timeline
      if (payload.title !== undefined && payload.title !== registration.title) {
        if (!registration.title) logsToEmit.push('PAPER_CREATED');
        else logsToEmit.push('TITLE_UPDATED');
      }
      if (payload.abstract !== undefined && payload.abstract !== registration.abstract) {
        logsToEmit.push('ABSTRACT_UPDATED');
      }
      if (payload.keywords !== undefined && JSON.stringify(payload.keywords) !== JSON.stringify(registration.keywords)) {
        logsToEmit.push('KEYWORDS_UPDATED');
      }
      if (payload.conferenceTrack !== undefined && payload.conferenceTrack !== registration.conferenceTrack) {
        logsToEmit.push('TRACK_CHANGED');
      }

      for (const field of allowedFields) {
        if (payload[field] !== undefined) {
          if (JSON.stringify(registration[field]) !== JSON.stringify(payload[field])) {
             registration[field] = payload[field];
             hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        // Create history snapshot
        registration.previousVersions.push({
          version: registration.version,
          payload: registration.toObject(),
          savedAt: new Date()
        });
        
        registration.version += 1;
        await registration.save({ session });

        // Basic DRAFT_SAVED
        await new AuditLog({
          user: userId,
          action: 'DRAFT_SAVED',
          targetId: teamId.toString()
        }).save({ session });

        // Specific Timeline Events
        for (const action of logsToEmit) {
          await new AuditLog({
            user: userId,
            action,
            targetId: teamId.toString()
          }).save({ session });
        }
      }

      if (session) { await session.commitTransaction(); session.endSession(); }
      return registration;
    } catch (error) {
      if (session) { await session.abortTransaction(); session.endSession(); }
      throw error;
    }
  }

  async processUpload(teamId, userId, fileBuffer, originalName, mimeType) {
    let session = null;
    if (checkIsReplicaSet()) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    try {
      const registration = await Registration.findOne({ team: teamId }).session(session);
      if (!registration) {
        const err = new Error('Draft not found'); err.code = 'REG_001'; err.statusCode = 404; throw err;
      }

      // 1. Check duplicate via checksum
      const { generateChecksum } = require('../utils/fileHelpers');
      const checksum = generateChecksum(fileBuffer);
      if (registration.previousVersions.some(v => v.checksum === checksum) || (registration.payload?.checksum === checksum)) { // rudimentary check
        // Simplified: The frontend usually just re-uploads. Let's just allow it or rely on Cloudinary.
        // For strict duplicate prevention, we can store checksum in the DB. We'll add it to payload.
      }

      const versionStr = `v${registration.version}`;
      const uniqueId = Math.random().toString(36).substring(7);
      const fileName = `NEXUS2026_${teamId}_${versionStr}_${uniqueId}`;
      
      const storageService = require('./storageService');
      const uploadResult = await storageService.uploadBufferStream(fileBuffer, fileName);

      // Save previous version file info if exists
      if (registration.fileUrl) {
         registration.previousVersions.push({
            version: registration.version,
            fileUrl: registration.fileUrl,
            filePublicId: registration.filePublicId,
            savedAt: new Date()
         });
         registration.version += 1;
      }

      registration.fileUrl = uploadResult.url;
      registration.filePublicId = uploadResult.publicId;
      registration.status = 'Paper Uploaded';
      
      await registration.save({ session });

      const actionType = registration.previousVersions.length > 0 ? 'PDF_REPLACED' : 'PDF_UPLOADED';
      
      await new AuditLog({
        user: userId,
        action: actionType,
        targetId: teamId.toString()
      }).save({ session });

      if (session) { await session.commitTransaction(); session.endSession(); }
      return registration;
    } catch (error) {
      if (session) { await session.abortTransaction(); session.endSession(); }
      throw error;
    }
  }

  async finalSubmit(teamId, leaderId) {
    let session = null;
    if (checkIsReplicaSet()) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    try {
      const registration = await Registration.findOne({ team: teamId }).session(session).populate('team');
      if (!registration) {
        const err = new Error('Draft not found'); err.code = 'REG_001'; err.statusCode = 404; throw err;
      }
      if (registration.status === 'Submitted' || registration.status === 'Locked') {
        const err = new Error('Already submitted'); err.code = 'REG_002'; err.statusCode = 400; throw err;
      }

      const team = await Team.findById(teamId).session(session).populate('leader');
      if (!team) {
         const err = new Error('Team not found'); err.code = 'TM_008'; err.statusCode = 404; throw err;
      }

      // Check required fields
      if (!registration.fileUrl || !registration.title || !registration.abstract || !registration.conferenceTrack) {
        const err = new Error('Missing required registration data or PDF upload.'); err.code = 'REG_400'; err.statusCode = 400; throw err;
      }

      // Generate Registration Number
      // Find count of submitted for the format NEXUS2026-REG-XXXX
      const count = await Registration.countDocuments({ registrationNumber: { $exists: true } }).session(session);
      const regNumber = `NEXUS2026-REG-${(count + 1).toString().padStart(4, '0')}`;

      registration.registrationNumber = regNumber;
      registration.status = 'Submitted';
      registration.declarationChecked = true;
      
      team.isLocked = true;

      await registration.save({ session });
      await team.save({ session });

      await new AuditLog({
        user: leaderId,
        action: 'FINAL_SUBMITTED',
        targetId: teamId.toString()
      }).save({ session });

      await new AuditLog({
        user: leaderId,
        action: 'REGISTRATION_LOCKED',
        targetId: teamId.toString()
      }).save({ session });

      if (session) { await session.commitTransaction(); session.endSession(); }

      // Fire email asynchronously
      try {
        const sendEmail = require('../utils/email');
        await sendEmail({
          email: team.leader.email,
          subject: `Registration Submitted - ${regNumber}`,
          html: `
            <h2>Registration Submitted Successfully</h2>
            <p>Dear ${team.leader.name},</p>
            <p>Your team <strong>${team.teamName}</strong> has been successfully registered.</p>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">
               <h3 style="margin:0; color:#166534">Registration Number: ${regNumber}</h3>
            </div>
            <p>Your team roster and paper details are now officially locked.</p>
            <p>Thank you!</p>
          `
        });
      } catch(emailErr) {
        console.error("Failed to send submission email: ", emailErr);
      }

      return registration;
    } catch (error) {
      if (session) { await session.abortTransaction(); session.endSession(); }
      throw error;
    }
  }

  async resubmit(teamId, leaderId) {
    let session = null;
    if (checkIsReplicaSet()) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    try {
      const team = await Team.findById(teamId).session(session);
      const registration = await Registration.findOne({ team: teamId }).session(session);

      if (team.status !== 'Needs Correction') {
        throw { code: 'RG_005', statusCode: 400, message: 'Only items in Needs Correction state can be resubmitted.' };
      }

      team.status = 'Submitted';
      team.isLocked = true;
      await team.save({ session });

      registration.status = 'Submitted';
      await registration.save({ session });

      await AuditLog.create([{
        user: leaderId,
        action: 'REGISTRATION_RESUBMITTED',
        targetId: teamId.toString()
      }], { session });

      if (session) await session.commitTransaction();
      return registration;

    } catch (error) {
      if (session) await session.abortTransaction();
      throw error;
    } finally {
      if (session) session.endSession();
    }
  }
}

module.exports = new RegistrationService();
