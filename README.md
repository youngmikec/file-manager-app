# File Manager

A secure file management application that allows authenticated users to organize files and folders, upload files directly to object storage using presigned URLs, and share files through secure share links.

## Tech Stack

### Backend

* Node.js
* TypeScript
* Fastify
* PostgreSQL
* Prisma ORM
* JWT Authentication
* MinIO (S3 Compatible Storage)

### Frontend

* Next.js
* Tailwind CSS

### Infrastructure

* Docker
* Docker Compose

---

# Architecture Overview

The application follows a direct-to-storage upload architecture.

Instead of sending file bytes through the backend:

```text
Client -> Backend -> Storage
```

the application uses presigned URLs:

```text
Client -> Backend -> Presigned URL
Client -> MinIO Upload
Client -> Backend Upload Completion
```

This reduces backend load, improves scalability, and follows modern cloud storage practices.

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

## Folder Management

* Create Folder
* Nested Folder Support
* Retrieve Folder Contents
* Soft Delete Support

## File Management

* Multi-file Upload Support
* Presigned Upload URLs
* Upload Completion Verification
* File Metadata Storage
* Soft Delete Support

## Sharing

* Generate Share Links
* Expiring Share Tokens
* Public File Access via Share Token

---

# Database Models

## User

Stores application users.

## Folder

Supports nested folder structures.

## File

Stores file metadata and storage references.

## ShareToken

Stores file sharing tokens and expiration dates.

---

# Project Structure

```text
file-manager/
│
├── backend/
│
├── frontend/
│
├── docker-compose.yml
│
├── .env.example
│
└── README.md
```

---

# Local Setup

## Prerequisites

* Node.js 18+
* Docker
* Docker Compose

---

## Clone Repository

```bash
git clone <repository-url>

cd file-manager
```

---

## Start Infrastructure

```bash
docker compose up -d
```

This starts:

* PostgreSQL
* MinIO

---

## Configure Environment Variables

Create:

```bash
backend/.env
```

using:

```env
NODE_ENV=development

HOST=0.0.0.0
PORT=4000

DATABASE_URL=postgresql://postgres:postgres@localhost:5433/file_manager?schema=public

JWT_SECRET=your-super-secret-jwt-key

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password123
MINIO_BUCKET=file-manager
MINIO_USE_SSL=false
```

---

## Backend Setup

```bash
cd backend

npm install
```

Run database migrations:

```bash
npx prisma migrate deploy
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start the API:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:4000
```

---

## MinIO Dashboard

```text
http://localhost:9001
```

Credentials:

```text
Username: admin
Password: password123
```

---

# Upload Flow

1. User requests upload initialization.
2. Backend creates file records.
3. Backend generates presigned upload URLs.
4. Frontend uploads directly to MinIO.
5. Frontend calls upload completion endpoint.
6. Backend verifies object existence.
7. File status changes from:

```text
PENDING -> READY
```

---

# API Overview

## Auth

```http
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Folder

```http
POST   /folders
GET    /folders/:folderId
PATCH  /folders/:folderId
DELETE /folders/:folderId
```

## Upload

```http
POST /uploads/init
POST /uploads/:fileId/complete
```

## Files

```http
GET    /files/:fileId
DELETE /files/:fileId
```

## Sharing

```http
POST /files/:fileId/share
GET  /share/:token
```

---

# Design Decisions

### PostgreSQL

Chosen for strong relational integrity and support for hierarchical folder structures.

### Prisma

Chosen for type-safe database access and improved developer productivity.

### MinIO

Chosen because it is fully S3-compatible and can be run locally through Docker.

### Presigned Upload URLs

Chosen to prevent file bytes from passing through the backend server and improve scalability.

### Soft Deletes

Files and folders are not permanently removed. Records are marked using `deletedAt` to support recovery and auditing.

---

# Current Status

* ✅ Auth foundation
* ✅ Folder Management
* ✅ Upload Initialization
* ✅ Minio Integration
* ✅ Database Schema
* ✅ Docker setup



# Future Improvements

* Drag-and-drop uploads
* Upload retry support
* Chunked uploads for large files
* File versioning
* Search functionality
* Background cleanup jobs
* Comprehensive test coverage
