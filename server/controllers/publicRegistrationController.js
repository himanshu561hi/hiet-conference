const User = require('../models/User');
const Team = require('../models/Team');
const Registration = require('../models/Registration');
const AuditLog = require('../models/AuditLog');
const sendEmail = require('../utils/email');
const storageService = require('../services/storageService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

// Generate auto password: firstName(lower) + last4 of mobile
const generatePassword = (fullName, mobile) => {
  const firstName = fullName.trim().split(' ')[0].toLowerCase();
  const last4 = mobile.replace(/\D/g, '').slice(-4);
  return `${firstName}${last4}`;
};

// Generate a unique join code for the team
const generateJoinCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * POST /api/v1/public/register
 * Public endpoint — no auth needed.
 * Creates users, team, registration, uploads PDF, sends emails.
 */
exports.publicRegister = async (req, res) => {
  try {
    const {
      // Team Info
      teamName,
      institute,
      conferenceTrack,
      teamType, // 'Solo' or 'Team'

      // Leader details
      leaderName,
      leaderEmail,
      leaderMobile,
      leaderBranch,
      leaderYear,

      // Members (JSON string array from form-data)
      members: membersRaw,

      // Paper Details
      paperTitle,
      paperAbstract,
      paperCategory,
      presentationPreference,
      keywords: keywordsRaw,
    } = req.body;

    // Parse members if sent as JSON string
    let membersData = [];
    try {
      membersData = membersRaw ? JSON.parse(membersRaw) : [];
    } catch {
      membersData = [];
    }

    // Parse keywords
    let keywords = [];
    try {
      keywords = keywordsRaw ? JSON.parse(keywordsRaw) : [];
    } catch {
      keywords = typeof keywordsRaw === 'string' ? keywordsRaw.split(',').map(k => k.trim()) : [];
    }

    // ── Step 1: Create or fetch users ──────────────────────────────────────

    const createOrFindUser = async ({ fullName, email, mobile, branch, year }) => {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        // Update isVerified if not already
        if (!existing.isVerified) {
          existing.isVerified = true;
          await existing.save();
        }
        return { user: existing, isNew: false, plainPassword: null };
      }

      const plainPassword = generatePassword(fullName, mobile);
      const user = new User({
        fullName,
        email: email.toLowerCase(),
        mobile,
        password: plainPassword, // will be hashed by pre-save hook
        isVerified: true,
        role: 'user',
      });
      await user.save();
      return { user, isNew: true, plainPassword };
    };

    // Create leader
    const {
      user: leaderUser,
      isNew: leaderIsNew,
      plainPassword: leaderPassword,
    } = await createOrFindUser({
      fullName: leaderName,
      email: leaderEmail,
      mobile: leaderMobile,
      branch: leaderBranch,
      year: leaderYear,
    });

    // Create members
    const memberResults = [];
    for (const m of membersData) {
      if (!m.email || !m.name || !m.mobile) continue;
      const result = await createOrFindUser({
        fullName: m.name,
        email: m.email,
        mobile: m.mobile,
        branch: m.branch || '',
        year: m.year || '',
      });
      memberResults.push({ ...result, memberData: m });
    }

    // ── Step 2: Create Team ────────────────────────────────────────────────

    // Check if team name already taken
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return sendError(res, 409, 'TM_001', `Team name "${teamName}" is already taken. Please choose another.`, null, req);
    }

    // Build members array for team (leader + all members)
    const allMembers = [
      { user: leaderUser._id, userId: leaderUser.userId },
      ...memberResults.map(r => ({ user: r.user._id, userId: r.user.userId })),
    ];

    const team = new Team({
      teamName,
      teamType: membersData.length === 0 ? 'Solo' : 'Team',
      joinCode: generateJoinCode(),
      teamId: `HIET/TM/${Date.now()}`,
      leader: leaderUser._id,
      members: allMembers,
      status: 'Registration Completed',
    });
    await team.save();

    // ── Step 3: Create Registration ────────────────────────────────────────

    const registration = new Registration({
      team: team._id,
      version: 1,
      status: req.file ? 'Paper Uploaded' : 'Registration Completed',
      title: paperTitle || '',
      abstract: paperAbstract || '',
      paperCategory: paperCategory || '',
      presentationPreference: presentationPreference || '',
      conferenceTrack: conferenceTrack || '',
      keywords: keywords,
      language: 'English',
    });

    // ── Step 4: Upload PDF if provided ─────────────────────────────────────

    if (req.file) {
      const fileName = `NEXUS2026_${team._id}_v1_${Date.now()}`;
      const uploadResult = await storageService.uploadBufferStream(req.file.buffer, fileName);
      registration.fileUrl = uploadResult.url;
      registration.filePublicId = uploadResult.publicId;
    }

    await registration.save();

    // Audit log
    await AuditLog.create({
      user: leaderUser._id,
      action: 'REGISTRATION_SUBMITTED',
      targetId: team._id.toString(),
    });

    // ── Step 5: Send confirmation emails ──────────────────────────────────

    const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/login`;

    const buildEmailHtml = (recipientName, email, plainPassword, isNew, teamDetails) => {
      const credentialsSection = isNew
        ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 8px 0;font-weight:600;color:#166534;">🔐 Your Auto-Generated Login Credentials</p>
            <p style="margin:4px 0;color:#1e293b;"><strong>Email:</strong> ${email}</p>
            <p style="margin:4px 0;color:#1e293b;"><strong>Password:</strong> <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;">${plainPassword}</code></p>
            <p style="margin:8px 0 0 0;font-size:12px;color:#6b7280;">You can change your password after logging in.</p>
          </div>`
        : `<p style="color:#374151;">Use your existing password to login.</p>`;

      return `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#059669,#047857);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">NEXUS 2026</h1>
          <p style="color:#d1fae5;margin:8px 0 0 0;font-size:14px;">International Conference on Emerging Technologies</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1e293b;margin:0 0 8px 0;">🎉 Registration Successful!</h2>
          <p style="color:#64748b;margin:0 0 24px 0;">Dear <strong>${recipientName}</strong>, your team has been successfully registered.</p>

          <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:0 0 16px 0;">
            <h3 style="color:#059669;margin:0 0 12px 0;font-size:16px;">Team Details</h3>
            <p style="margin:4px 0;color:#374151;"><strong>Team Name:</strong> ${teamDetails.teamName}</p>
            <p style="margin:4px 0;color:#374151;"><strong>Institute:</strong> ${teamDetails.institute}</p>
            <p style="margin:4px 0;color:#374151;"><strong>Track:</strong> ${teamDetails.track || 'N/A'}</p>
            <p style="margin:4px 0;color:#374151;"><strong>Paper Title:</strong> ${teamDetails.paperTitle || 'Not provided'}</p>
          </div>

          ${credentialsSection}

          <a href="${loginUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:8px 0 16px 0;">
            Login to Dashboard →
          </a>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
          <p style="font-size:12px;color:#94a3b8;margin:0;">This is an automated email from NEXUS 2026. Please do not reply.</p>
        </div>
      </div>`;
    };

    const teamDetails = {
      teamName,
      institute,
      track: conferenceTrack,
      paperTitle,
    };

    // Send email to leader
    const leaderEmailHtml = buildEmailHtml(
      leaderName, leaderEmail, leaderPassword, leaderIsNew, teamDetails
    );
    sendEmail({
      email: leaderEmail,
      subject: '🎉 NEXUS 2026 — Team Registration Confirmed!',
      html: leaderEmailHtml,
    }).catch(err => console.error('[Email Error - Leader]:', err));

    // Send emails to members
    for (const { user: memberUser, isNew: mIsNew, plainPassword: mPassword, memberData } of memberResults) {
      const memberEmailHtml = buildEmailHtml(
        memberData.name, memberData.email, mPassword, mIsNew, teamDetails
      );
      sendEmail({
        email: memberData.email,
        subject: '🎉 NEXUS 2026 — You have been registered as a Team Member!',
        html: memberEmailHtml,
      }).catch(err => console.error('[Email Error - Member]:', err));
    }

    // ── Step 6: Auto-login the leader (set JWT cookie) ────────────────────

    const generateToken = require('../utils/generateToken');
    generateToken(res, leaderUser._id);

    // ── Step 7: Respond ────────────────────────────────────────────────────

    return sendSuccess(res, 201, 'Registration successful! Check your email for login credentials.', {
      // User data for AuthContext (same format as login)
      user: {
        _id: leaderUser._id,
        userId: leaderUser.userId,
        fullName: leaderUser.fullName,
        email: leaderUser.email,
        role: leaderUser.role,
      },
      team: {
        id: team._id,
        teamName: team.teamName,
        teamId: team.teamId,
      },
      loginEmail: leaderEmail,
      loginPassword: leaderPassword || '(use your existing password)',
    }, req);

  } catch (error) {
    console.error('[PublicRegistration Error]:', error);
    // Mongoose duplicate key
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return sendError(res, 409, 'DUP_001', `${field === 'teamName' ? 'Team name' : 'Email'} already exists.`, null, req);
    }
    return sendError(res, 500, 'SYS_500', error.message || 'Registration failed.', null, req);
  }
};
