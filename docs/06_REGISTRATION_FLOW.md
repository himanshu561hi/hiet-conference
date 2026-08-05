# Registration Flow

1. **Dashboard Initialization**
   - User verifies email and logs in.
   - Redirected to Dashboard.
   - Prompted to Create/Join Team.

2. **Team Creation / Member Onboarding**
   - Team ID is generated and members are finalized.

3. **Registration Form**
   - Leader fills out Academic Details, Contact Info, and Personal details.
   - Capable of saving as **Draft** multiple times without strict validation.

4. **Paper Upload (Draft Stage)**
   - Leader uploads Abstract, Keywords, PDF, and Payment Proof.
   - Status remains "Draft".

5. **Final Submit**
   - Strict Zod validation executes.
   - All required fields, PDFs, and payment proofs are verified.
   - Registration status changes to **Submitted**.
   - Entire form becomes **Locked** (Read-only for all members).

6. **Admin Review**
   - Admin views the Registration & Submission.
   - Changes status to:
     - **Approved**: Everything is correct.
     - **Rejected**: Invalid.
     - **Needs Correction**: Unlocks the form for the team to fix specific issues (e.g., blurry payment proof).
