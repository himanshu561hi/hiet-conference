# Error Codes & Handling

## Overview
This document standardizes every API error response for the Team Management module. 
The backend must map all failures to these exact codes. The frontend will parse these codes to display user-friendly messages.

## Standard JSON Error Response Format
```json
{
  "status": "error",
  "code": "TM_001",
  "message": "User Message",
  "details": "Developer Message / Technical context"
}
```

---

## Team Management Codes (TM_XXX)

| Code   | HTTP Status | User Message                               | Developer Message |
|--------|-------------|--------------------------------------------|-------------------|
| TM_001 | 400         | Team name already exists.                  | `name` fails uniqueness check in DB. |
| TM_002 | 400         | You are already part of an active team.    | User attempting to create/join while `teamId` is present in profile. |
| TM_003 | 400         | Team capacity exceeded.                    | Attempting to add member but team count >= 3. |
| TM_004 | 400         | Invalid or expired Join Code.              | Join Code does not match or team is locked. |
| TM_005 | 400         | Invitation expired or not found.           | Join request > 7 days old or deleted. |
| TM_006 | 403         | Only the Team Leader can perform this action.| Insufficient role permissions. |
| TM_007 | 403         | Action blocked. The team is locked.        | Attempted CRUD operation on a `Submitted` or `Locked` team. |
| TM_008 | 404         | Team not found.                            | Invalid `teamId` or `isDeleted: true`. |
| TM_009 | 400         | Cannot submit. Minimum member count not met. | Attempted Final Submit on a `Team` type with 1 member. |
| TM_010 | 400         | Cannot regenerate Join Code.               | Regeneration attempted after members have joined. |
| TM_011 | 400         | Missing registration fields.               | Final Submit triggered but required payload fields are empty. |
| TM_012 | 400         | Research paper not uploaded.               | Final Submit triggered but PDF is missing. |
| TM_013 | 403         | You cannot leave the team.                 | Leader attempting to leave instead of delete/transfer. |
| TM_014 | 400         | User already invited.                      | Active invite exists for this user. |
| TM_015 | 429         | Too many join requests. Try again later.   | User hit rate limiter for join requests. |
| TM_016 | 400         | Cannot change Team Type.                   | Leader attempting to change from `Team` to `Solo` while members exist. |
