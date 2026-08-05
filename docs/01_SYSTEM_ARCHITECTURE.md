# System Architecture

## Overview
NEXUS 2026 RPMS (Research Paper Management System) follows a modern, decoupled MERN architecture. It ensures high performance, scalability, and clean code separation.

## Frontend (Client)
- **Framework**: React 19 + Vite for optimal bundling and fast HMR.
- **Styling**: Tailwind CSS configured with a centralized Design System.
- **State Management**: 
  - Global Server State: TanStack React Query.
  - Form State: React Hook Form + Zod validation.
- **Routing**: React Router DOM (v6+).
- **Animations**: Framer Motion.

## Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: Modular Controller-Service-Route structure.
- **API Standard**: RESTful JSON API with `/api/v1` versioning.

## Database
- **Primary Database**: MongoDB (NoSQL)
- **ODM**: Mongoose
- **Deployment**: MongoDB Atlas (Cloud)

## External Services & Storage
- **File Storage**: Cloudinary (for PDFs, Payment Proofs, and Image assets).
- **Email Service**: Nodemailer (via SMTP provider) for notifications and verifications.
- **Authentication**: Custom JWT implementation (no third-party auth).

## Deployment Ready Architecture
- **Frontend Hosting**: Vercel / Netlify / Cloudflare Pages.
- **Backend Hosting**: Render / Railway / AWS EC2.
- **CI/CD**: GitHub Actions (planned for automated testing and deployment).
