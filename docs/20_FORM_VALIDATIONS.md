# Form Validations

## Signup Form
- **Name**: Required, min 3 chars.
- **Email**: Required, valid regex.
- **Password**: Required, min 8 chars, 1 uppercase, 1 number.

## Create Team Form
- **Team Type**: Required (Enum: Solo, Team).
- **Team Name**: Required, min 3 chars, max 30 chars, alphanumeric.

## Registration Form
- **Institution Name**: Required, min 3 chars.
- **State**: Required (Dropdown).
- **Phone Number**: Required, Regex: `/^[0-9]{10}$/`.
- **Payment Proof**: Required for Final Submit. Max 2MB, Image/PDF.

## Paper Submission Form
- **Paper Title**: Required, min 10 chars.
- **Abstract**: Required, min 50 words, max 300 words.
- **Keywords**: Required, min 3, max 7 (Comma separated).
- **Track**: Required (Dropdown).
- **PDF File**: Required, Max 5MB, strictly PDF.

## Zod Implementation Standard
All frontend forms must map 1:1 with a Zod schema. The exact same Zod schema will be utilized on the backend using an Express validator middleware.
