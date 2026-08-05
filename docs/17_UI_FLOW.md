# UI Flow & Logic

## Conditional Rendering
- **Navbar (Public)**: If JWT exists, replace `[Login]` with `[Dashboard]`.
- **Dashboard Access**: If Role === 'Admin', redirect `/dashboard` to `/admin`.
- **Team State in Dashboard**: 
  - If `teamId` is null -> Render empty state "Create or Join Team".
  - If `teamId` exists but `role` === 'Member' -> Hide "Edit", "Submit" buttons.

## Step-by-Step Flow Logic
- **Registration Form**: Cannot be accessed unless Team is created.
- **Paper Upload**: Cannot be accessed unless Registration Form is 100% complete.
- **Final Submit**: Disabled until Registration and Paper Upload are both marked as complete.
- **Post-Submission**: If status is `Submitted`, `Approved`, `Rejected` -> Registration & Paper forms are disabled (Read-only UI).
- **Needs Correction**: If status is `Needs Correction`, Registration & Paper forms are unlocked but show a prominent Warning Alert with admin notes.
