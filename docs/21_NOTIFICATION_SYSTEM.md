# Notification System

## Toast Notifications (UI)
Using `react-hot-toast`.
- **Success**: Green icon. Used for "Saved successfully", "Logged in", "Link copied".
- **Error**: Red icon. Used for "Network error", "Invalid credentials", "Validation failed".
- **Info**: Blue icon. Used for "Upload in progress".

## In-App Notifications (Dashboard)
Stored in DB, accessible via the Bell icon in Navbar/Dashboard.
- **Join Request Received**: Warns Leader.
- **Join Request Accepted**: Warns Member.
- **Status Changed**: Warns entire team when Admin updates status.

## Email Notifications (External)
- Handled by Nodemailer.
- Critical path alerts (Verification, Password Reset, Status Change, Final Submission Receipt).
- Styled using a standard HTML email template matching the Emerald/Blue brand colors.
