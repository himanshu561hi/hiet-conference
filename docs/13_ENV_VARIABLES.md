# Environment Variables

## Frontend (`client/.env`)
```env
# Base URL for Backend API
VITE_API_URL=http://localhost:5000/api/v1

# Current Environment
VITE_NODE_ENV=development
```

## Backend (`server/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0...
MONGODB_USERNAME=admin
MONGODB_PASSWORD=secret

# Security
JWT_SECRET=super_secret_key_here
JWT_EXPIRES_IN=7d

# Email Service (SMTP)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=admin@example.com
EMAIL_PASS=smtp_password

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```
