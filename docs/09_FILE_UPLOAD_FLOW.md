# File Upload Flow

## Architecture
- All files are uploaded from the Frontend directly to the Backend via `multipart/form-data`.
- Backend uses `multer` (MemoryStorage) to buffer the file.
- Buffered file is uploaded to **Cloudinary** using `cloudinary.uploader.upload_stream`.
- Cloudinary URL and Public ID are stored in MongoDB.

## Validation
### 1. Research Paper (PDF)
- **Allowed Types**: `application/pdf`
- **Max Size**: 5 MB
- **Validation Stage**: Backend multer filter & Frontend dropzone accept.

### 2. Payment Proof (Image/PDF)
- **Allowed Types**: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- **Max Size**: 2 MB

### 3. Student ID (Optional Image)
- **Allowed Types**: `image/jpeg`, `image/png`, `image/webp`
- **Max Size**: 2 MB

## Storage Optimization
- Images uploaded to Cloudinary are automatically optimized (`q_auto, f_auto`).
- PDFs are stored raw.
