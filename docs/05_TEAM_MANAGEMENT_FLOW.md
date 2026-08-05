# Team Management Flow

## Roles
- **Leader**: Creates the team, pays fees, submits the paper, manages members.
- **Member**: Joins an existing team, read-only access to team submissions.
- **Admin**: Platform administrator.
*(Note: No generic "Participant" role once a team is formed).*

## Team Creation
1. Leader selects **Team Type**: `Solo` or `Team`.
2. Provides `Team Name`.
3. System Auto-Generates **Team ID**: Format `HIET/TM/1000` (auto-incrementing).
4. If `Solo`: Max members locked to 1.
5. If `Team`: Max members locked to 3 (including Leader).

## Joining Workflow
- **Invite Based**: Leader enters member's email. Member receives email link to accept.
- **Request Based**: Member searches by Team ID and requests to join. Leader receives notification and can Accept/Reject.

## Permissions
- **Leader**: Full Edit rights. Can lock submission.
- **Member**: Can view status, download submitted paper, leave team.
