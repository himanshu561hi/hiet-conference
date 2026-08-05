# Admin Error Codes
**Phase 11**

Defines strict API error codes returned during Admin Operations.

## Error Definitions

| Error Code | HTTP Status | Description | Trigger |
| :--- | :--- | :--- | :--- |
| `ADM_001` | 403 Forbidden | Unauthorized Access | A non-admin user attempts to hit an Admin API route. |
| `ADM_002` | 404 Not Found | Registration Not Found | The provided Registration ID does not exist. |
| `ADM_003` | 400 Bad Request | Invalid Status Transition | Attempting to Approve a Draft that hasn't been Submitted. |
| `ADM_004` | 400 Bad Request | Missing Reason | Attempting to Reject or Request Correction without providing a textual reason. |
| `ADM_005` | 400 Bad Request | Already Reviewed | Attempting to Review a registration that is already Approved or Rejected. |
| `ADM_006` | 500 Internal Server Error | Transaction Failed | The MongoDB ACID transaction failed to commit during an Admin operation. |
| `ADM_007` | 403 Forbidden | Cannot Review Own Paper | An Admin who is also a Leader/Member of a team attempts to review their own team's paper. |
