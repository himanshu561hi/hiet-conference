const User = require('../models/User');
const Team = require('../models/Team');
const Registration = require('../models/Registration');
const AuditLog = require('../models/AuditLog');
const Otp = require('../models/Otp');
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

// Generate a 6-character Alphanumeric OTP (unambiguous uppercase characters and digits)
const generateAlphanumericOTP = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
};

// @desc Send OTP to Leader Email
// @route POST /api/v1/public/send-otp
exports.sendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, 400, 'VAL_001', 'Email is required', null, req);
    }

    const cleanEmail = email.toLowerCase().trim();
    const otp = generateAlphanumericOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save or update OTP in MongoDB for reliable serverless deployment on Vercel
    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    // Await sending email with personality so Vercel doesn't freeze lambda before delivery
    await sendEmail({
      email: cleanEmail,
      subject: '✨ NEXUS 2026 Registration — Your Alphanumeric Verification Code',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%); padding: 40px 20px; text-align: center; color: #ffffff;">
            <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); padding: 6px 16px; border-radius: 30px; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px;">Official Author Verification</div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.5px;">NEXUS 2026</h1>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #d1fae5; font-weight: 500;">International Conference on Emerging Technologies</p>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 800;">Welcome, Team Leader! 🚀</h2>
            <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">You are one step closer to leading your team and showcasing your research at <strong style="color: #059669;">NEXUS 2026</strong>. To confirm your primary email address and unlock registration, please use your unique security code below:</p>
            
            <div style="background: #f0fdf4; border: 2px dashed #34d399; border-radius: 16px; padding: 25px; text-align: center; margin: 30px 0;">
              <span style="font-size: 11px; font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 10px;">Your 6-Character Verification Code</span>
              <div style="font-size: 38px; font-weight: 900; color: #059669; letter-spacing: 10px; font-family: 'Courier New', Courier, monospace; background: #ffffff; padding: 12px 24px; border-radius: 12px; display: inline-block; border: 1px solid #a7f3d0; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.05);">${otp}</div>
            </div>

            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.5;"><strong>🔒 Security Note:</strong> This verification code is valid for <strong>10 minutes</strong> and is strictly tied to your team leader identity. Please do not share this code with unauthorized parties.</p>
            </div>

            <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">If you didn't request this verification, please safely discard this email or contact our support desk.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 600;">© 2026 NEXUS International Conference | HIET Group</p>
            <p style="margin: 6px 0 0 0; font-size: 11px; color: #94a3b8;">Empowering Green Technology & Innovation in Artificial Intelligence</p>
          </div>
        </div>
      `
    });

    // Do NOT return OTP in response payload to prevent UI developer fallback toast
    return sendSuccess(res, 200, 'OTP sent to your email successfully! Please check inbox and spam.', {
      email
    }, req);
  } catch (error) {
    console.error('[Send OTP Error]:', error);
    return sendError(res, 500, 'SYS_500', 'Failed to send OTP email. Please check credentials and try again.', null, req);
  }
};

// @desc Verify OTP
// @route POST /api/v1/public/verify-otp
exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return sendError(res, 400, 'VAL_002', 'Email and OTP are required', null, req);
    }

    const cleanEmail = email.toLowerCase().trim();
    const cached = await Otp.findOne({ email: cleanEmail });
    if (!cached || cached.expiresAt < new Date()) {
      return sendError(res, 400, 'VAL_003', 'OTP expired or not found. Please click Send OTP again.', null, req);
    }

    // Case-insensitive verification for alphanumeric code
    if (cached.otp.trim().toUpperCase() !== otp.trim().toUpperCase()) {
      return sendError(res, 400, 'VAL_004', 'Invalid alphanumeric OTP entered. Please check and try again.', null, req);
    }

    cached.verified = true;
    await cached.save();

    return sendSuccess(res, 200, 'Email verified successfully!', { email, verified: true }, req);
  } catch (error) {
    console.error('[Verify OTP Error]:', error);
    return sendError(res, 500, 'SYS_500', 'Failed to verify OTP', null, req);
  }
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
      participationType, // 'Individual' or 'Team'
      isStudent,

      // Academic/Professional info
      collegeName,
      branch: leaderBranch,
      year: leaderYear,
      organizationName,
      state,
      district,

      // Leader details
      leaderName,
      leaderEmail,
      leaderMobile,

      // Members (JSON string array from form-data)
      members: membersRaw,

      // Paper Details
      paperTitle,
      paperAbstract,
      uniqueness,
      paperCategory,
      paperSubCategory,
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

    // Limit to max 2 members excluding leader (Total team size max 3)
    if (participationType === 'Team' && membersData.length > 2) {
      return sendError(res, 400, 'REG_015', 'Maximum 2 team members allowed excluding the leader.', null, req);
    }
    if (participationType === 'Individual') {
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

    const createOrFindUser = async ({ fullName, email, mobile, college, branch, year, organizationName, state, district, isStudent }) => {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        if (!existing.isVerified) existing.isVerified = true;
        if (college) existing.college = college;
        if (branch) existing.branch = branch;
        if (year) existing.year = year;
        if (organizationName) existing.organizationName = organizationName;
        if (state) existing.state = state;
        if (district) existing.district = district;
        if (isStudent !== undefined) existing.isStudent = isStudent;
        await existing.save();
        return { user: existing, isNew: false, plainPassword: null };
      }

      const plainPassword = generatePassword(fullName, mobile);
      const user = new User({
        fullName,
        email: email.toLowerCase(),
        mobile,
        password: plainPassword,
        isVerified: true,
        role: 'user',
        isStudent: isStudent !== false,
        college: college || '',
        branch: branch || '',
        year: year || '',
        organizationName: organizationName || '',
        state: state || '',
        district: district || '',
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
      college: collegeName || institute || '',
      branch: leaderBranch,
      year: leaderYear,
      organizationName,
      state,
      district,
      isStudent: isStudent !== false,
    });

    // Create members
    const memberResults = [];
    for (const m of membersData) {
      if (!m.email || !m.name || !m.mobile) continue;
      const result = await createOrFindUser({
        fullName: m.name,
        email: m.email,
        mobile: m.mobile,
        college: m.college || collegeName || institute || '',
        branch: m.branch || '',
        year: m.year || '',
        state: state || '',
        district: district || '',
        isStudent: isStudent !== false,
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
      {
        user: leaderUser._id,
        userId: leaderUser.userId,
        name: leaderUser.fullName,
        email: leaderUser.email,
        mobile: leaderUser.mobile,
        college: collegeName || institute || leaderUser.college || '',
        branch: leaderBranch || leaderUser.branch || '',
        year: leaderYear || leaderUser.year || '',
        organizationName: organizationName || leaderUser.organizationName || '',
        state: state || leaderUser.state || '',
        district: district || leaderUser.district || '',
        isStudent: isStudent !== false,
      },
      ...memberResults.map(r => ({
        user: r.user._id,
        userId: r.user.userId,
        name: r.memberData.name || r.user.fullName,
        email: r.memberData.email || r.user.email,
        mobile: r.memberData.mobile || r.user.mobile,
        college: r.memberData.college || r.user.college || collegeName || institute || '',
        branch: r.memberData.branch || r.user.branch || '',
        year: r.memberData.year || r.user.year || '',
        organizationName: organizationName || r.user.organizationName || '',
        state: state || r.user.state || '',
        district: district || r.user.district || '',
        isStudent: isStudent !== false,
      })),
    ];

    const team = new Team({
      teamName,
      teamType: membersData.length === 0 ? 'Solo' : 'Team',
      joinCode: generateJoinCode(),
      teamId: `HIET/TM/${Date.now()}`,
      leader: leaderUser._id,
      institute: collegeName || institute || leaderUser.college || '',
      state: state || '',
      district: district || '',
      members: allMembers,
      status: 'Registration Completed',
    });
    await team.save();

    // ── Step 3: Create Registration ────────────────────────────────────────

    const registration = new Registration({
      team: team._id,
      registrationNumber: team.teamId,
      version: 1,
      status: req.file ? 'Paper Uploaded' : 'Registration Completed',
      title: paperTitle || '',
      abstract: paperAbstract || '',
      uniqueness: uniqueness || paperAbstract || '',
      paperCategory: paperCategory || '',
      paperSubCategory: paperSubCategory || (keywords && keywords[0]) || '',
      presentationPreference: presentationPreference || '',
      conferenceTrack: conferenceTrack || '',
      keywords: keywords,
      language: 'English',
      isStudent: isStudent !== false,
      collegeName: collegeName || institute || '',
      branch: leaderBranch || '',
      year: leaderYear || '',
      organizationName: organizationName || '',
      state: state || '',
      district: district || '',
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

    // Await sending email to leader to ensure Vercel does not terminate Lambda before completion
    const leaderEmailHtml = buildEmailHtml(
      leaderName, leaderEmail, leaderPassword, leaderIsNew, teamDetails
    );
    try {
      await sendEmail({
        email: leaderEmail,
        subject: '🎉 NEXUS 2026 — Team Registration Confirmed!',
        html: leaderEmailHtml,
      });
    } catch (err) {
      console.error('[Email Error - Leader]:', err);
    }

    // Await sending emails to members
    for (const { user: memberUser, isNew: mIsNew, plainPassword: mPassword, memberData } of memberResults) {
      const memberEmailHtml = buildEmailHtml(
        memberData.name, memberData.email, mPassword, mIsNew, teamDetails
      );
      try {
        await sendEmail({
          email: memberData.email,
          subject: '🎉 NEXUS 2026 — You have been registered as a Team Member!',
          html: memberEmailHtml,
        });
      } catch (err) {
        console.error('[Email Error - Member]:', err);
      }
    }

    // ── Step 6: Auto-login the leader (set JWT cookie & return token) ─────

    const generateToken = require('../utils/generateToken');
    const token = generateToken(res, leaderUser._id);

    // ── Step 7: Respond ────────────────────────────────────────────────────

    return sendSuccess(res, 201, 'Registration successful! Check your email for login credentials.', {
      // User data for AuthContext (same format as login)
      user: {
        _id: leaderUser._id,
        userId: leaderUser.userId,
        fullName: leaderUser.fullName,
        email: leaderUser.email,
        role: leaderUser.role,
        token,
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
