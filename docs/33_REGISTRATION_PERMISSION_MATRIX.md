# Registration Permission Matrix
**Version 1.0**

Defines Role-Based Access Control (RBAC) specifically for the Registration module.

| Action | Leader | Member | Admin | Notes |
|--------|--------|--------|-------|-------|
| **Save Draft** | ✅ | ❌ | ❌ | Triggers Auto-Save / Versioning |
| **Edit Draft** | ✅ | ❌ | ❌ | |
| **Delete Draft** | ✅ | ❌ | ❌ | Only before Final Submit |
| **Upload Paper** | ✅ | ❌ | ❌ | Must pass File Validation Engine |
| **Replace Paper** | ✅ | ❌ | ❌ | Updates Registration History |
| **Change Author Order** | ✅ | ❌ | ❌ | |
| **Final Submit** | ✅ | ❌ | ❌ | Locks Registration & Team |
| **View Registration** | ✅ | ✅ | ✅ | Members have Read-Only access |
| **Download PDF** | ✅ | ✅ | ✅ | |
| **Approve** | ❌ | ❌ | ✅ | Triggers Approval workflow |
| **Reject** | ❌ | ❌ | ✅ | Triggers Rejection workflow |
| **Needs Correction**| ❌ | ❌ | ✅ | Unlocks Draft for Leader edits |

### Notes
- **Members**: Members have complete visibility into the Registration Progress and can download the submitted PDF, but they cannot edit forms, trigger saves, or alter author orders.
- **Admin**: Admins cannot natively edit a team's draft; they must push the state to `Needs Correction` to force the Leader to make edits.
