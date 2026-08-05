# Email Workflow

## Triggers

1. **Signup Verification**
   - Triggered when a new user signs up.
   - Action: Send verification link with token.

2. **Password Reset**
   - Triggered when "Forgot Password" is requested.
   - Action: Send OTP/Link.

3. **Team Invitation**
   - Triggered by Leader to invite a member.
   - Action: Send invitation link with Team ID.

4. **Team Join Request**
   - Triggered by Member requesting to join a team.
   - Action: Send notification email to Leader.

5. **Registration Submitted**
   - Triggered upon "Final Submit".
   - Action: Send confirmation to all team members.

6. **Registration Status Change**
   - Triggered by Admin.
   - Actions:
     - If **Approved**: Send Success/Welcome email.
     - If **Needs Correction**: Send actionable email with Admin notes.
     - If **Rejected**: Send rejection notice.
