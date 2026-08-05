# State Machine Specification

## Overview
This document defines every possible state transition within the Team Management and Registration lifecycle. The system must enforce these strict directional transitions.

---

## Allowed States
- `Draft`
- `Registration Started`
- `Registration Completed`
- `Paper Uploaded`
- `Submitted`
- `Under Review`
- `Approved`
- `Rejected`
- `Needs Correction`
- `Locked`
- `Deleted` (Soft Delete)

---

## State Transitions Matrix

| Current State           | Action Performed                 | Next State               | Allowed Role   | Validation / Conditions |
|-------------------------|----------------------------------|--------------------------|----------------|-------------------------|
| *(None)*                | Create Team                      | `Draft`                  | Leader         | User must not be in any team. Capacity checks pass based on Team Type. |
| `Draft`                 | Add first registration data      | `Registration Started`   | Leader         | Required team minimum members met. |
| `Registration Started`  | Save final valid registration    | `Registration Completed` | Leader         | All registration fields validated. |
| `Registration Completed`| Upload research paper            | `Paper Uploaded`         | Leader         | PDF must be uploaded and scanned. |
| `Paper Uploaded`        | Click Final Submit               | `Submitted`              | Leader         | All required files, fields, and team capacity constraints verified. Team is locked post-submit. |
| `Submitted`             | Admin begins review              | `Under Review`           | Admin          | None. |
| `Under Review`          | Admin approves paper             | `Approved`               | Admin          | None. |
| `Under Review`          | Admin rejects paper entirely     | `Rejected`               | Admin          | Rejection reason must be provided. |
| `Under Review`          | Admin requests changes           | `Needs Correction`       | Admin          | Correction details must be provided. Unlocks team for edits. |
| `Needs Correction`      | Upload fixed paper/form & Submit | `Submitted`              | Leader         | Same validations as initial submit. |
| *Any non-locked State*  | Leader deletes team              | `Deleted` (Soft Delete)  | Leader         | Cannot delete if `Submitted`, `Under Review`, `Approved`. |
| *Any State*             | Deadline passes                  | `Locked`                 | System (Cron)  | Freezes all teams globally preventing edits or joins. |

---

## Additional Rules
- **Fallback Transitions:** If a team is in `Registration Started` but a member leaves (putting team size < minimum), the state immediately falls back to `Draft`.
- **Locking:** Once a team enters `Submitted`, all standard CRUD operations on members, papers, and registration fields are blocked for Leaders and Members.
