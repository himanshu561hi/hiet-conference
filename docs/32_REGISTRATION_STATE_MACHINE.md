# Registration State Machine
**Version 1.0**

This document tracks every possible state transition within the Registration and Paper Submission workflow.

| Current State | Next State | Allowed Roles | Validation / Hook Rules |
|---------------|------------|---------------|-------------------------|
| **(None)** | `Draft` | Leader | Leader clicks 'Start Registration'. Team must not be locked. |
| `Draft` | `Draft` | Leader | Auto-save or Manual save triggers version increment. |
| `Draft` | `Paper Uploaded` | Leader | PDF passes MIME, Size, and Extension validation. |
| `Paper Uploaded`| `Draft` | Leader | User modifies paper details or replaces PDF. |
| `Paper Uploaded`| `Submitted` | Leader | All required fields present. Declaration checked. Final submit clicked. |
| `Submitted` | `Under Review`| Admin | Admin claims the registration for evaluation. |
| `Under Review`| `Approved` | Admin | Admin approves paper. Triggers Approval Email. Locks Team definitively. |
| `Under Review`| `Rejected` | Admin | Admin rejects paper. Triggers Rejection Email. Team remains Locked. |
| `Under Review`| `Needs Correction` | Admin | Admin requests changes. State reverts to open. Notes provided to team. |
| `Needs Correction` | `Resubmitted` | Leader | Leader updates required details/PDF and clicks submit. |
| `Resubmitted` | `Approved` / `Rejected` | Admin | Admin evaluates the corrected submission. |

### Global State Rules
- **Automatic Lock**: When transitioning to `Submitted` or `Resubmitted`, the Team state is automatically flagged as Locked.
- **Correction Window**: If transitioning to `Needs Correction`, the Team Lock is temporarily lifted exclusively for registration edits (member removal/addition remains blocked).
