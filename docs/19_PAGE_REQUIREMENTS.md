# Page Requirements

## 1. Dashboard / Overview
- **Purpose**: High-level status tracking.
- **User Role**: Leader, Member.
- **Required Data**: Team details, registration status, paper submission status.
- **Actions**: "Create Team", "Join Team", "Edit Draft".
- **Empty State**: Prompt to create or join a team.
- **Loading State**: Skeleton cards.

## 2. Team Management
- **Purpose**: Manage members.
- **User Role**: Leader (Edit), Member (Read).
- **Required Data**: List of `TeamMembers`, Pending `JoinRequests`.
- **Actions**: "Invite Member", "Accept Request", "Reject Request", "Remove Member".
- **Permissions**: Only Leader can Invite/Accept/Remove.

## 3. Registration Form
- **Purpose**: Capture academic and personal details.
- **User Role**: Leader.
- **Required Data**: Institution name, Department, Year, State, Phone, Payment Proof URL.
- **Actions**: "Save Draft", "Upload Image".
- **Error State**: Invalid image format, missing required fields.

## 4. Admin - Reviews
- **Purpose**: Approve or reject submissions.
- **User Role**: Admin.
- **Required Data**: Aggregated Registration + Team + Paper data.
- **Actions**: "Approve", "Reject", "Needs Correction".
- **Modal**: Confirmation modal before changing status, with an optional textarea for notes.
