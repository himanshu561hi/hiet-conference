# Route Structure

## Frontend Routes (React Router)

### Public
- `/` - Landing Page
- `/about` - About Nexus/HIET
- `/tracks` - Conference Tracks
- `/committee` - Organizing Committee
- `/contact` - Contact Form

### Authentication (Public & Guest Only)
- `/auth/login`
- `/auth/signup`
- `/auth/verify-email`
- `/auth/forgot-password`

### Protected (Require Login)
- `/dashboard` - Overview (Redirects based on Team status)
- `/dashboard/team` - Team Management (Create/Join/Manage)
- `/dashboard/registration` - Registration Form & Payment Details
- `/dashboard/paper` - Paper Submission Form

### Admin (Require Admin Role)
- `/admin` - Admin Dashboard
- `/admin/teams` - Manage Teams
- `/admin/registrations` - Review Registrations
- `/admin/papers` - Review Papers

## Backend Routes (Express)
- `/api/v1/auth/*`
- `/api/v1/teams/*`
- `/api/v1/registrations/*`
- `/api/v1/papers/*`
- `/api/v1/admin/*`
- `/api/v1/uploads/*`
