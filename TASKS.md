# Nexus 2026 Detailed Tasks Checklist

This file contains the detailed, granular checklist for all features, APIs, database updates, and UI components to track the project's state thoroughly.

## Phase 1: Public Website (Detailed Tasks)

### 1. Project Setup
- [x] Initialize Git repository
- [x] Set up Frontend (React / Vite / Next.js boilerplate)
- [x] Set up Backend (Node.js / Express boilerplate)
- [x] Configure Tailwind CSS
- [x] Setup Linter and Prettier

### 2. Folder Structure
- [x] Define frontend folder structure (components, pages, utils, hooks, assets, etc.)
- [x] Define backend folder structure (controllers, routes, models, middleware, config, etc.)

### 3. Theme Configuration
- [x] Set up color palette in Tailwind config
- [x] Set up typography (fonts) in Tailwind config
- [x] Create base CSS file for global styles

### 4. Navbar
- [ ] Create Navbar component
- [ ] Add logo and navigation links
- [ ] Implement mobile responsive menu

### 5. Hero Section
- [ ] Create Hero component
- [ ] Add main heading, subtext, and call-to-action buttons
- [ ] Implement background image/video or pattern

### 6. About Sections
- [ ] Create About Nexus section
- [ ] Create About Tech Fusion section
- [ ] Create About HIET section
- [ ] Create About ICDETGT section

### 7. Conference Tracks
- [ ] Create Tracks section
- [ ] List all technical tracks and sub-themes
- [ ] Add hover effects or accordion for details

### 8. Timeline
- [ ] Create Timeline component
- [ ] Map out key dates (submission deadline, notification date, registration, conference dates)

### 9. Organizing Committee
- [ ] Create Committee section
- [ ] Create card layouts for committee members (photo, name, designation)

### 10. Sponsors
- [ ] Create Sponsors section
- [ ] Add sponsor logos with links

### 11. Contact & Footer
- [ ] Create Contact form component (Name, Email, Message)
- [ ] Set up FAQ section
- [ ] Create Footer component with quick links, address, and social icons

---

## Phase 2: Design System & UI Foundation

### 1. Design Tokens
- [x] Configure Emerald Green / Deep Blue palette
- [x] Define typography scale (H1-H4, Body, Caption)
- [x] Set up spacing system

### 2. UI Components
- [x] `Button.jsx` (Primary, Secondary, Outline, Ghost, Danger)
- [x] `Input.jsx` (Text, Textarea, Checkbox, Radio, Toggle)
- [x] `Card.jsx` (Header, Title, Content, Footer)
- [x] `Badge.jsx` (Success, Warning, Error, Default)
- [x] `Alert.jsx` (Success, Warning, Info, Danger)
- [x] `Modal.jsx` (Framer Motion powered)
- [x] `Table.jsx` (Headers, Rows, Cells)

### 3. Layouts
- [x] `PublicLayout.jsx`
- [x] `DashboardLayout.jsx`
- [x] `AuthLayout.jsx`
- [x] `AdminLayout.jsx`

### 4. Animations
- [x] Create `animations.js` (Fade, Slide Up, Scale, Stagger)

---

## Phase 3: Product Architecture & Database Design

### Documentation
- [x] `01_SYSTEM_ARCHITECTURE.md`
- [x] `02_DATABASE_SCHEMA.md`
- [x] `03_API_STRUCTURE.md`
- [x] `04_AUTHENTICATION_FLOW.md`
- [x] `05_TEAM_MANAGEMENT_FLOW.md`
- [x] `06_REGISTRATION_FLOW.md`
- [x] `07_ADMIN_WORKFLOW.md`
- [x] `08_EMAIL_WORKFLOW.md`
- [x] `09_FILE_UPLOAD_FLOW.md`
- [x] `10_ROUTE_STRUCTURE.md`
- [x] `11_FOLDER_ARCHITECTURE.md`
- [x] `12_SECURITY_GUIDELINES.md`
- [x] `13_ENV_VARIABLES.md`

---

## Phase 4: UX Planning & Wireframes

### Documentation
- [x] `14_INFORMATION_ARCHITECTURE.md`
- [x] `15_USER_JOURNEY.md`
- [x] `16_WIREFRAMES.md`
- [x] `17_UI_FLOW.md`
- [x] `18_COMPONENT_MAP.md`
- [x] `19_PAGE_REQUIREMENTS.md`
- [x] `20_FORM_VALIDATIONS.md`
- [x] `21_NOTIFICATION_SYSTEM.md`

---

## Phase 5: Development Foundation

### Components & Setup
- [x] Shared Components (Navigation, Footer, SEO, Breadcrumb)
- [x] Layout Components (Section, Container, Grid, Stack, Divider)
- [x] State Components (Loader, ErrorState, EmptyState)
- [x] Utilities (ScrollToTop, PageTransition, RouteGuards)
- [x] Constants (routes, roles, status, theme)
- [x] Centralized Content (home, about, tracks, footer)
- [x] Asset Directories (logos, icons, illustrations, backgrounds)

---

## Phase 6: Public Website Implementation (Complete)

### Pages & Sections
- [x] Announcement Bar
- [x] Navbar
- [x] Hero Section
- [x] Live Countdown
- [x] Trusted By (Partners)
- [x] About Nexus
- [x] About Tech Fusion
- [x] About HIET
- [x] About ICDETGT
- [x] Conference Statistics
- [x] Why Participate
- [x] Conference Tracks
- [x] Publication Section
- [x] Brochure Download CTA
- [x] Important Dates Timeline
- [x] Organizing Committee
- [x] Advisory Board
- [x] Chief Patrons & Patrons
- [x] Partner Organizations
- [x] FAQ
- [x] Venue
- [x] Contact
- [x] Footer

---

## Phase 7: Authentication System
- [x] Signup (Full Name, Email, Mobile, Password)
- [x] Password Validation (Zod - min 8, uppercase, lowercase, num, special)
- [x] Email Verification (OTP logic & Timer)
- [x] Login (JWT generation)
- [x] Forgot Password Stub
- [x] Session Management (HTTP Only Cookies)

## Phase 8: User Profile Initialization
- [x] Auto Login post-verification
- [x] `InitializeProfile.jsx` Form (Institute, Dept, Roll No, etc.)
- [x] User ID generation (`HIET/USR/XXXX`)

---

## Phase 9: Team Management (Module 1 - Creation)
- [x] Create Team Database Model
- [x] Implement padded Team ID generator (`HIET/TM/XXXX`)
- [x] Implement alphanumeric Join Code generator
- [x] Create backend API layer (Route -> Validation -> Controller -> Service)
- [x] Integrate standard Response formatting and Request IDs
- [x] Build `CreateTeam.jsx` form
- [x] Build `TeamDashboard.jsx` UI

---

## Phase 9: Team Management (Module 2 - Invitations & Requests)
- [x] Create `Invitation`, `JoinRequest`, and `Notification` Database Models
- [x] Implement multi-channel `NotificationService` (Email + In-App)
- [x] Create `inviteService` and `requestService` with strict business rules and Transactions
- [x] Implement Validation Schemas, Controllers, and Routes
- [x] Build `MemberDashboard.jsx` (Join by Code UI)
- [x] Update `TeamDashboard.jsx` (Leader Invites UI)

---

## Phase 9: Team Management (Module 3 - Finalization)
- [x] Backend logic for Removing Members & Leaving Teams
- [x] Backend logic for Leadership Transfers
- [x] Apply Strict Team Lock Rules (TM_007)
- [x] Build `TeamTimeline.jsx` utilizing `AuditLog` collection
- [x] Build `TeamProgress.jsx` tracking statuses
- [x] Update Dashboard Layout

---

## Future Phases Detailed Tasks
*(Will be expanded as we approach these phases)*

## Phase 10.0: Cross-Cutting Infrastructure
- [x] Backend Response, File, and Storage services
- [x] Backend Multer Memory Storage Middleware
- [x] Frontend standardized Toasts and API Error Handlers
- [x] Advanced Hooks (`useAutosave`, `useUpload`, `usePermissions`, etc.)
- [x] Standardized Modals and Loaders
- [x] Error Pages (404, 403, 500)

---

## Future Phases Detailed Tasks
*(Will be expanded as we approach these phases)*

## Phase 10.1: Registration Form
- [x] Create Registration Mongoose Model
- [x] Implement Draft API Endpoints and `registrationService`
- [x] Build `RegistrationDashboard.jsx` (Progress Tracking, Layout)
- [x] Build `RegistrationForm.jsx`
- [x] Integrate `useAutosave` and `zod` schema
- [x] Add Timeline events for `DRAFT_SAVED`

---

## Future Phases Detailed Tasks
*(Will be expanded as we approach these phases)*

## Phase 10.2: Research Paper Details
- [x] Add metadata fields to Registration model
- [x] Setup Zod validation rules (max words/chars)
- [x] Multi-step Refactor (General, Paper, Authors)
- [x] Interactive Chip Inputs & Live Word Counters
- [x] Professional Author Cards mapping
- [x] Live `PaperPreviewCard` integration
- [x] Timeline extensions (`ABSTRACT_UPDATED`, etc.)

---

## Future Phases Detailed Tasks
*(Will be expanded as we approach these phases)*

## Phase 10.3: PDF Upload Pipeline
- [x] Integrate Cloudinary Stream API and Streamifier
- [x] Built Backend Upload Controllers with Memory Storage
- [x] Versioning logic maintaining `previousVersions`
- [x] Create Beautiful `PdfUploader.jsx` Dropzone
- [x] Live Progress Tracking Bar
- [x] Timeline Audit Logs (`PDF_UPLOADED`, `PDF_REPLACED`)

---

## Future Phases Detailed Tasks
*(Will be expanded as we approach these phases)*

## Phase 10.4: Final Submission
- [x] Update `Registration.js` and `Team.js` schemas with locking/reg number fields
- [x] Implement `sendSubmissionConfirmationEmail` in `emailService.js`
- [x] Implement `finalSubmit` transaction in `registrationService.js`
- [x] Expose `POST /submit` route in `registrationRoutes.js`
- [x] Create `FinalSubmissionTab.jsx` (Validation Checklist, Declaration)
- [x] Update `RegistrationForm.jsx` to incorporate 4th Tab
- [x] Update `usePermissions.js` to respect `team.isLocked`
- [x] Update `TeamTimeline.jsx` with new audit logs

---

## Future Phases Detailed Tasks
*(Will be expanded as we approach these phases)*

## Phase 11.1: Admin Review Queue
- [x] Add Mongoose indexes to `Registration.js`
- [x] Create `adminController.js` (`getMetrics`, `getQueue`)
- [x] Create `adminRoutes.js` and mount in `server.js`
- [x] Create `adminApi.js`
- [x] Build reusable `DataTable.jsx`
- [x] Build `AdminQueue.jsx` and `AdminDashboard.jsx`
- [x] Mount `/admin/dashboard` in `App.jsx`

---

## Future Phases Detailed Tasks
*(Will be expanded as we approach these phases)*

## Phase 11.2: Admin Review (PDF Viewer & Details)
- [x] Implement `getRegistrationDetails` in `adminController.js`
- [x] Mount `/registration/:id` in `adminRoutes.js`
- [x] Create `AdminRegistrationReview.jsx` (Layout, Accordions, Sticky Sidebar)
- [x] Build `PdfViewer.jsx` component
- [x] Build `AdminAuditLog.jsx` wrapping `DataTable.jsx`
- [x] Hook up View button in `AdminQueue.jsx`
- [x] Mount `/admin/registration/:id` in `App.jsx`

---

## Future Phases Detailed Tasks
*(Will be expanded as we approach these phases)*

- Phase 11.3: Admin Decision Workflows (Approve, Reject, Correction)
