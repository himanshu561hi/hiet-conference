# API Structure

*Base URL: `/api/v1`*

## Authentication (`/auth`)
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate and receive JWT
- `POST /auth/verify-email` - Verify email token
- `POST /auth/forgot-password` - Request OTP/Link
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/logout` - Clear session (if using cookies)
- `GET /auth/me` - Get current user profile

## Teams (`/teams`)
- `POST /teams` - Create a new team (Generates HIET/TM/XXXX)
- `GET /teams/my-team` - Get user's current team details
- `POST /teams/invite` - Send join invite (Leader only)
- `POST /teams/join-request` - Request to join a team
- `PUT /teams/requests/:id` - Accept/Reject request (Leader only)
- `DELETE /teams/members/:id` - Remove a member (Leader only)

## Registrations (`/registrations`)
- `POST /registrations` - Create draft registration
- `PUT /registrations` - Update registration draft
- `POST /registrations/submit` - Finalize registration

## Paper Submissions (`/papers`)
- `POST /papers` - Submit paper details & PDF
- `PUT /papers/:id` - Update paper (if unlocked)
- `GET /papers/my-paper` - Get team's paper

## Admin (`/admin`)
- `GET /admin/stats` - Overall dashboard statistics
- `GET /admin/teams` - List all teams with filters
- `GET /admin/registrations` - List registrations for review
- `PUT /admin/registrations/:id/status` - Approve/Reject/Needs Correction
- `GET /admin/papers` - List submitted papers
- `GET /admin/logs` - View audit logs

## File Uploads (`/uploads`)
- `POST /uploads/pdf` - Upload paper PDF
- `POST /uploads/image` - Upload payment proof
