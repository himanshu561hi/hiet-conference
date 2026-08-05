# Permission Matrix

## Overview
This matrix strictly defines what actions are Allowed, Denied, or Conditional based on the user's role (Leader, Member, Admin) within the Team Management lifecycle.

---

## Matrix

| Action                        | Leader        | Member        | Admin         | Conditions / Notes |
|-------------------------------|---------------|---------------|---------------|--------------------|
| **Create Team**               | Allowed       | Denied        | Denied        | Must not be in any active team. |
| **Edit Team Details**         | Conditional   | Denied        | Allowed       | Leader: Only in `Draft` or `Needs Correction`. |
| **Invite Member**             | Conditional   | Denied        | Allowed       | Leader: Only before `Submitted`. Must have capacity. |
| **Accept Invite**             | Denied        | Conditional   | Denied        | Member: Only if not in another team. |
| **Reject Invite**             | Denied        | Allowed       | Denied        | |
| **Remove Member**             | Conditional   | Denied        | Allowed       | Leader: Only before `Submitted`. Cannot remove self. |
| **Leave Team**                | Denied        | Conditional   | Denied        | Member: Only before `Submitted`. Leader must Delete or Transfer. |
| **Delete Team (Soft Delete)** | Conditional   | Denied        | Allowed       | Leader: Only before `Submitted`. |
| **Generate Join Code**        | Conditional   | Denied        | Allowed       | Leader: Only if no members have joined yet. |
| **Edit Registration**         | Conditional   | Denied        | Allowed       | Leader: Only before `Submitted` or if `Needs Correction`. |
| **Save Draft**                | Conditional   | Denied        | Denied        | Leader: Only before `Submitted`. |
| **Upload Paper**              | Conditional   | Denied        | Allowed       | Leader: Only before `Submitted` or if `Needs Correction`. |
| **Final Submit**              | Conditional   | Denied        | Denied        | Leader: Validations must pass. Team > min capacity. |
| **Approve Submission**        | Denied        | Denied        | Allowed       | Admin only. |
| **Reject Submission**         | Denied        | Denied        | Allowed       | Admin only. |
| **Request Corrections**       | Denied        | Denied        | Allowed       | Admin only. Unlocks editing for Leader. |
| **View Dashboard**            | Allowed       | Allowed       | Allowed       | Read-only for Members. |
| **View Notifications**        | Allowed       | Allowed       | Allowed       | |
| **View Audit Logs**           | Denied        | Denied        | Allowed       | Admin only. |

---

## Legend
- **Allowed:** Action can be performed freely.
- **Denied:** Action is explicitly forbidden and must return `403 Forbidden`.
- **Conditional:** Action can only be performed if the Team State allows it (e.g., cannot edit a `Submitted` team).
