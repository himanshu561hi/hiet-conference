# Admin Permission Matrix
**Phase 11**

Defines what entities can perform which actions during the Admin Review Phase.

## Roles
- `Leader`: The creator of the Team.
- `Member`: A participant in the Team.
- `Admin`: A user with `role === 'admin'`.

## Matrix

| Action | Leader | Member | Admin | Notes |
| :--- | :---: | :---: | :---: | :--- |
| View Admin Queue | ❌ | ❌ | ✅ | Only Admins can see the global submission list. |
| View Own Submission | ✅ | ✅ | ✅ | Team members can view their own locked read-only submission. |
| Claim Submission | ❌ | ❌ | ✅ | Transitions `Submitted` to `Under Review`. |
| Approve Registration | ❌ | ❌ | ✅ | Final Approval. |
| Reject Registration | ❌ | ❌ | ✅ | Final Rejection. |
| Request Correction | ❌ | ❌ | ✅ | Unlocks team and pushes back to draft pool. |
| Emergency Unlock | ❌ | ❌ | ✅ | Admins only. Reverses an Approved/Rejected decision. |
| Edit After Correction | ✅ | ❌ | ❌ | Only the Leader can make changes when unlocked. |
| Resubmit After Correction | ✅ | ❌ | ❌ | Only the Leader can click Final Submit again. |
