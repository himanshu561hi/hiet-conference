# File Storage Specification
**Version 1.0**

Defines the enterprise storage architecture for managing research paper uploads.

## 1. Storage Architecture
- **Temporary Uploads (Processing Phase)**: Handled completely in-memory using `multer` with MemoryStorage. Prevents local disk I/O bottlenecks and eliminates the need for aggressive local garbage collection.
- **Permanent Uploads**: Pushed to **Cloudinary** via a secure backend stream.
- **Future Proofing**: The service layer will be written using an adapter pattern (e.g., `StorageService.upload()`), allowing seamless migration from Cloudinary to AWS S3 in the future without altering the controller logic.

## 2. Storage Folder Structure (Cloudinary)
- **Root Directory**: `nexus2026/`
- **Sub-Directory**: `papers/`
- **Full Path**: `nexus2026/papers/`

## 3. Upload & Validation Pipeline
1. **Client** uploads a file (`multipart/form-data`).
2. **Express Middleware** (`multer`) buffers the file in memory.
3. **Validation Engine** verifies:
   - **Allowed Extensions**: `.pdf` exclusively.
   - **Allowed MIME Types**: `application/pdf` exclusively. (Prevents malicious users renaming `.exe` to `.pdf`).
   - **Maximum File Size**: 10 MB limit enforced at the multer middleware level.
4. **Cloudinary Stream API** pipes the buffer directly to cloud storage.
5. **MongoDB** saves the returned secure URL and Cloudinary `public_id`.

## 4. File Naming Convention
To ensure absolute uniqueness and easy tracing, files uploaded to Cloudinary will follow this convention:
`NEXUS2026_[TeamID]_v[VersionNumber]_[UUID].pdf`
*Example:* `NEXUS2026_HIET-TM-0001_v2_f83h4b.pdf`

## 5. Versioning Strategy & Replacement Rules
- **Versioning Strategy**: Every time a user uploads a new paper, it does **not** overwrite the existing file in the cloud. A new file is uploaded with an incremented version number in the filename.
- **Replacement Rules**: When a user replaces a paper on their draft, the old file's reference is moved to an internal `previousVersions` array in the database, preserving the historical integrity of the submission.
- **Duplicate Prevention**: The system will compute a quick SHA-256 hash of the buffer. If the hash matches the currently active file for that team, the upload is rejected to save bandwidth.

## 6. Cleanup Rules
- **Soft Deletion**: If a Registration Draft is permanently deleted (or reset), the associated Cloudinary files are NOT immediately destroyed. They are marked as `pending_deletion`.
- **Garbage Collection**: A nightly backend Cron Job will securely execute the Cloudinary Destroy API for all files marked as `pending_deletion` over 7 days ago.
