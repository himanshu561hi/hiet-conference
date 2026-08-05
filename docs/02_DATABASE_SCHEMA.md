# Database Schema Design

## 1. Users
- **Purpose**: Core authentication and profile management.
- **Fields**: `_id`, `name`, `email`, `password`, `role` (Leader, Member, Admin), `isVerified`, `verificationToken`, `resetToken`.
- **Relationships**: 1:1 with Teams (if Leader), 1:1 with TeamMembers (if Member).
- **Indexes**: `email` (Unique).
- **Validation**: Email regex, Password hash length.

## 2. Teams
- **Purpose**: Grouping participants.
- **Fields**: `_id`, `teamId` (e.g. HIET/TM/1001), `teamName`, `type` (Solo, Team), `leaderId`, `status`.
- **Relationships**: 1:M with TeamMembers, 1:1 with Registrations.
- **Indexes**: `teamId` (Unique), `leaderId` (Unique).

## 3. TeamMembers
- **Purpose**: Track members belonging to a team.
- **Fields**: `_id`, `teamId`, `userId`, `joinedAt`.
- **Relationships**: M:1 with Teams, 1:1 with Users.

## 4. JoinRequests
- **Purpose**: Workflow for members joining teams.
- **Fields**: `_id`, `teamId`, `userId`, `status` (Pending, Accepted, Rejected), `requestedAt`.
- **Indexes**: Compound index on `teamId` and `userId`.

## 5. Registrations
- **Purpose**: Track official conference registration status.
- **Fields**: `_id`, `teamId`, `academicDetails`, `paymentProofUrl`, `status` (Draft, Submitted, Under Review, Approved, Rejected, Needs Correction).
- **Relationships**: 1:1 with Teams.

## 6. PaperSubmissions
- **Purpose**: Managing research paper details and files.
- **Fields**: `_id`, `teamId`, `title`, `abstract`, `keywords`, `track`, `pdfUrl`, `submittedAt`.
- **Relationships**: 1:1 with Teams.

## 7. Notifications
- **Purpose**: In-app alerts for users.
- **Fields**: `_id`, `userId`, `title`, `message`, `isRead`, `createdAt`.
- **Relationships**: M:1 with Users.

## 8. Announcements
- **Purpose**: Global broadcasts from admins.
- **Fields**: `_id`, `title`, `content`, `authorId`, `createdAt`.

## 9. AdminLogs
- **Purpose**: Audit trails for admin actions.
- **Fields**: `_id`, `adminId`, `action`, `targetId`, `timestamp`.

## 10. EmailLogs
- **Purpose**: Track sent emails for troubleshooting.
- **Fields**: `_id`, `recipient`, `subject`, `status`, `sentAt`.

## 11. Settings
- **Purpose**: Global platform toggles.
- **Fields**: `_id`, `isRegistrationOpen`, `isSubmissionOpen`, `maxTeamSize`.
