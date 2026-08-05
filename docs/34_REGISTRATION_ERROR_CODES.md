# Registration Error Codes
**Version 1.0**

Standardized error codes for the Registration API endpoints.

| Error Code | HTTP Status | Trigger Condition / Message |
|------------|-------------|-----------------------------|
| `REG_001` | 404 | **Draft not found.** Triggered when attempting to resume a registration that does not exist in the database. |
| `REG_002` | 403 | **Registration Locked.** Triggered when attempting to Save, Upload, or Edit a registration that is in `Submitted`, `Approved`, or `Rejected` state. |
| `REG_003` | 400 | **Missing Required Field.** Triggered on Final Submit if Paper Details (Title, Abstract, Theme) are incomplete. |
| `REG_004` | 400 | **Paper Missing.** Triggered on Final Submit if no valid PDF is attached to the draft. |
| `REG_005` | 400 | **Declaration Required.** Triggered on Final Submit if the originality/non-plagiarism checkbox is false. |
| `REG_006` | 403 | **Only Leader Allowed.** Triggered if a Member attempts to POST/PUT/DELETE any registration endpoint. |
| `REG_007` | 400 | **Invalid File Type.** Triggered by the File Validation Engine if MIME type is not `application/pdf`. |
| `REG_008` | 413 | **File Too Large.** Triggered by the File Validation Engine if the PDF exceeds the maximum configured size. |
| `REG_009` | 409 | **Duplicate Upload.** Triggered if the exact same file hash is uploaded twice, or if a paper with an identical title/hash exists globally. |
| `REG_010` | 400 | **Invalid Author Configuration.** Triggered if the author order payload contains missing members or duplicate entries. |
| `REG_011` | 400 | **Invalid Version Target.** Triggered when attempting to restore a Draft Version that does not exist or is corrupted. |
