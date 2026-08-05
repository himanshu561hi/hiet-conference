# Admin Review Specification
**Phase 11**

## Overview
The Admin Review System allows authorized Administrators to manage the queue of submitted registrations, review metadata and uploaded papers, and determine the final status of a registration.

## Core Workflows

### 1. Admin Queue
- **Submitted Queue**: Displays all registrations with `status === 'Submitted'`.
- **Under Review Queue**: Displays registrations currently assigned to an Admin (`status === 'Under Review'`).
- **Resolved Queue**: Displays historical decisions (`Approved`, `Rejected`, `Needs Correction`).

### 2. Review Workflow
- Admin selects a `Submitted` registration.
- Status changes to `Under Review`.
- Admin reviews Paper Details, Authors, and the PDF file.
- Admin makes a decision: Approve, Reject, or request Correction.

### 3. Needs Correction Workflow
- Admin identifies a flaw (e.g., wrong formatting, missing author) but the paper is generally acceptable.
- Admin submits a **Correction Reason**.
- Registration status changes to `Needs Correction`.
- Team `isLocked` flag is temporarily removed, allowing the team to edit fields and upload a new PDF.
- Email is fired to the Leader with the Correction Reason.
- Once corrected, the Leader resubmits, and the status returns to `Submitted` with a "Resubmitted" flag.

### 4. Approval Workflow
- Admin determines the submission meets all requirements.
- Registration status changes to `Approved`.
- Registration is permanently locked.
- Team is permanently locked.
- Email is fired to all Team Members confirming acceptance.

### 5. Rejection Workflow
- Admin determines the submission completely violates guidelines (e.g., plagiarism, wrong track).
- Admin submits a **Rejection Reason**.
- Registration status changes to `Rejected`.
- Registration is permanently locked.
- Email is fired to the Leader with the Rejection Reason.

### 6. Unlock Workflow (Emergency)
- In rare edge cases, an Admin can manually trigger an "Emergency Unlock" on an Approved or Rejected registration.
- Returns status to `Needs Correction`.
- Audit Log is heavily flagged.

## Communications (Emails)
- **Review Started**: Optional, internal logging.
- **Needs Correction**: Sent to Leader immediately upon Admin action. Includes exact Admin notes.
- **Approved**: Sent to Leader and Members.
- **Rejected**: Sent to Leader immediately upon Admin action. Includes exact Admin notes.

## Audit Logs
Every admin action must spawn an immutable audit log attached to the `TeamTimeline`:
- `ADMIN_REVIEW_STARTED`
- `ADMIN_NEEDS_CORRECTION`
- `ADMIN_APPROVED`
- `ADMIN_REJECTED`
- `ADMIN_EMERGENCY_UNLOCK`
