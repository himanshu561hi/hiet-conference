# Phase 10: Registration System Specification
**Version 1.0**

This document serves as the single source of truth for the complete Registration and Paper Submission workflow.

## 1. Registration Workflow
The registration process follows a strict multi-step workflow. Users can exit and resume the flow at any point before `Final Submit`.

**Step 1: Draft Creation** (Auto-initiated when a team is complete and enters the flow)
↓
**Step 2: Resume Draft**
↓
**Step 3: Paper Details** (Title, Abstract, Keywords, Theme Track)
↓
**Step 4: Upload Files** (Research Paper PDF)
↓
**Step 5: Review** (Overview of all submitted data and team details)
↓
**Step 6: Declaration** (Checkbox confirming originality, non-plagiarism, etc.)
↓
**Step 7: Final Submit**
↓
**Step 8: Locked State** (No further edits allowed by team)
↓
**Step 9: Admin Review**
↓
**Step 10: Outcome** (Approved, Rejected, or Needs Correction)

---

## 2. Enterprise Features & Improvements

### A. Registration Versioning
Every time a draft is saved (either manually or via auto-save), the system creates an immutable version of the payload.
- **Flow**: `Version 1` → `Version 2` → `Version 3`
- **Purpose**: Acts as a safety net. If a submission breaks or data is lost on the client-side, the previous draft version can be immediately restored.

### B. Auto Save
To prevent data loss during the extensive registration process:
- **Trigger**: Every 30-60 seconds OR on significant blur/change events on form fields.
- **Flow**: `Editing` → `Auto Save` → `Draft Updated`
- **UI Element**: A continuous indicator displaying `Last Saved: X minutes ago`.

### C. Form Progress & Tracking
A visual progress bar tracking the overall completion percentage.
*Example UI States:*
- Profile: ✅
- Team: ✅
- Paper Details: ⏳ (In Progress)
- File Upload: ❌
- Review: ❌
- Submission: ❌
**Overall Completion**: 45%

### D. Registration History Timeline
A reusable chronological timeline component (similar to Team Activity Timeline) exclusively for tracking the registration lifecycle.
*Example Flow:*
`Draft Created` → `Paper Updated` → `PDF Replaced` → `Draft Saved` → `Submitted` → `Approved`

### E. File Validation Engine
Strict validation layer for paper uploads.
- **Type**: `.pdf` exclusively.
- **Checks**: 
  - Valid MIME type (`application/pdf`)
  - Valid Extension
  - Size limitation (Configurable globally, e.g., Max 10MB)
  - Duplicate File Hash check (Preventing users from uploading the exact same file twice accidentally).

### F. Author Order & Designation
The system must explicitly manage author sequencing and roles for the final publication.
- **Default Order**:
  - `Author 1 (Leader) - Corresponding Author`
  - `Author 2 (Member)`
  - `Author 3 (Member)`
- **Configuration**: The Leader can dynamically adjust the author order and designate a different Corresponding Author if the conference rules permit.
