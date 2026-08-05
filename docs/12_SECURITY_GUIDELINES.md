# Security Guidelines

## 1. Authentication Security
- **JWT**: Tokens must have a short/medium expiry (e.g., `7d`).
- **Password Hashing**: Use `bcrypt` with minimum salt rounds of 10.
- **No Password in Payloads**: Never return passwords or reset tokens in standard API responses.

## 2. API Security
- **Helmet**: Express Helmet middleware must be used to secure HTTP headers.
- **CORS**: Strictly configure Cross-Origin Resource Sharing to allow only specific frontend origins in production.
- **Rate Limiting**: Implement `express-rate-limit` to prevent brute force attacks on `/auth/login` and `/auth/forgot-password`.

## 3. Request Validation
- All incoming request bodies, query params, and route params must be validated.
- **Frontend**: Zod combined with React Hook Form.
- **Backend**: Express validator or Zod middleware to reject bad payloads before reaching controllers.

## 4. Audit Logging
- Admin actions (Approving, Rejecting, Changing roles) must be logged in the `AdminLogs` collection.
- Essential endpoints must utilize a logger (e.g., Morgan or custom console wrappers).

## 5. File Upload Security
- Multer file size limits are mandatory.
- Reject unsupported MIME types entirely.
