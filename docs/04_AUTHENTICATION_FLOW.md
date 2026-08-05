# Authentication Flow

1. **Signup**
   - User provides Name, Email, Password.
   - System hashes password (bcrypt).
   - System generates Verification Token.
   - Sends Email with Verification Link.
   - User account created with `isVerified: false`.

2. **Email Verification**
   - User clicks link in email.
   - Frontend extracts token from URL and calls API.
   - Backend verifies token, updates `isVerified: true`.

3. **Auto Login**
   - Upon successful verification, backend optionally returns JWT.
   - Frontend stores token and redirects to Dashboard.

4. **Login**
   - User enters Email and Password.
   - Backend validates credentials and `isVerified` status.
   - Returns JWT and User Object.

5. **Forgot Password**
   - User enters email.
   - System generates OTP/Reset Token and sends email.
   - User enters token and new password.
   - Password updated.
