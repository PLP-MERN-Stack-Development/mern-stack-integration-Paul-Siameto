# MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js. This project demonstrates seamless integration between front-end and back-end components, including database operations, API communication, and state management.

## 🚀 Features

### Core Features
- **User Authentication**: Registration, login, and protected routes
- **Blog Management**: Create, read, update, and delete blog posts
- **Category System**: Organize posts by categories
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Updates**: Optimistic UI updates for better UX
- **Search & Filtering**: Find posts by title, content, and category
- **Pagination**: Efficiently browse through posts

### Advanced Features
- **Image Uploads**: Featured images for blog posts
- **Tag System**: Categorize posts with tags
- **User Profiles**: Manage user information and bio
- **Admin Panel**: Category management for administrators
- **Error Handling**: Comprehensive error handling and validation
- **Loading States**: Smooth loading indicators throughout the app

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
# MERN Blog — Full-stack Example

This repository contains a full-stack blog application built with MongoDB, Express, React and Node.js (MERN). It demonstrates a working integration between frontend and backend, including authentication, CRUD for posts and categories, comments, pagination, search/filtering, and optimistic UI updates.

---

## At-a-glance

- Frontend: React + Vite, React Router, React Query, Tailwind CSS
- Backend: Node.js + Express, MongoDB + Mongoose
- Authentication: JWT-based (login/register, protected routes)
- Comments: API + client with optimistic updates
- File upload support installed (Cloudinary + multer) — wiring for uploads exists server-side; client upload UI may be partial

---

## What is implemented (checked against requested tasks)

Task 1 — Project Setup
- Directory structure for `client/` and `server/` — implemented
- MongoDB connection via Mongoose — implemented (`server/server.js`)
- Express server with middleware (helmet, morgan, cors, body parsers) — implemented
- React front-end (Vite) with proxy to API in `vite.config.js` — implemented
- Environment variable examples present: `server/env.example` and `client/.env.example` — implemented

Task 2 — Back-End Development
- REST API endpoints for posts (GET list, GET single, POST, PUT, DELETE) — implemented (`server/routes/posts.js`)
- Categories endpoints (GET, POST, PUT, DELETE) — implemented (`server/routes/categories.js`)
- Mongoose models for Post, Category (and User, Comment) with relationships — implemented (`server/models/*`)
- Input validation using `express-validator` — implemented in routes
- Error handling middleware — implemented in `server/server.js`

Task 3 — Front-End Development
- Post list view (`client/src/pages/PostList.jsx`) — implemented
- Single post view (`client/src/pages/PostDetail.jsx`) — implemented
- Create/Edit post form (`client/src/pages/CreatePost.jsx`, `EditPost.jsx`) — implemented
- Navigation and layout (`client/src/components/Layout.jsx`) — implemented
- React Router configured (`client/src/App.jsx`) — implemented
- State management via React Query and Context (`client/src/contexts/AuthContext.jsx`) — implemented
- API service (`client/src/services/api.js`) — implemented (axios instance + interceptors)

Task 4 — Integration and Data Flow
- Frontend API service communicates with backend — implemented
- State management for posts/categories via React Query — implemented
- Forms use `react-hook-form` and server validation returned for user feedback — implemented
- Optimistic UI for comments implemented in `client/src/components/Comments.jsx` — implemented
- Loading and error states handled with spinners/toasts — implemented

Task 5 — Advanced Features
- User authentication (register/login/protected routes) — implemented (`/api/auth`, `AuthContext`)
- Image uploads: server dependencies (`multer`, `cloudinary`) are present and `server/env.example` includes Cloudinary vars; client upload UI may be partial or not wired — PARTIAL
- Pagination for posts — implemented (`/api/posts` supports pagination and client reads pagination)
- Searching and filtering — implemented (text search and category filter)
- Comments feature — implemented (server `routes/comments.js`, client `Comments.jsx`)

Summary: The application is largely complete. The main partial item is a client-side image upload UI (server-side hooks exist). See "Missing / Recommended" below for details.

---

## Missing / Recommended improvements

- Image upload: backend supports Cloudinary (dependencies and env variables present). If you need direct image upload from the client, add a small upload form and a route that returns the Cloudinary URL (or upload during post creation). Consider using signed uploads for production.
- Tests: There are small test scripts (`server/test-api.js`) but no unit or integration test suite. Consider adding Jest/React Testing Library for front-end and supertest/mocha for backend.
- Security: fix `express-validator` transitive advisory when a fix is available; rotate default secrets and avoid checking real secrets into repo.
- Production build notes: review CORS origins, rate-limiting, and proper env provisioning for production deployment.
- Documentation: add Postman collection or OpenAPI spec for API if you want machine-readable docs.

---

## Quick setup (local development)

Prerequisites: Node.js (v18+), npm, MongoDB (local or Atlas)

1) Clone and install

```powershell
git clone <repo-url>
cd "mern-stack-integration-Paul-Siameto"
npm install
cd server
npm install
cd ../client
npm install
```

2) Add environment variables

Create `server/.env` (copy from `server/env.example`) and set real values.

Create `client/.env` (copy from `client/.env.example`) and set `VITE_API_URL` (default: `http://localhost:5000/api`).

3) Start servers

Option A — run servers separately (recommended for debugging):

```powershell
# Terminal 1: backend
cd server
npm run dev

# Terminal 2: frontend
cd client
npm run dev
```

Option B — from repo root run combined script (if present):

```powershell
npm run dev
```

Open the app at http://localhost:5173

---

## API Reference (summary)

All API endpoints are prefixed with `/api`.

Authentication
- POST /api/auth/register — Register (body: name, email, password)
- POST /api/auth/login — Login (body: email, password)
- GET /api/auth/me — Get current user (Authorization: Bearer <token>)
- PUT /api/auth/profile — Update profile (protected)

Posts
- GET /api/posts — List posts. Supports query params: `page`, `limit`, `search`, `category`, `status`.
- GET /api/posts/:id — Get single post (also populates comments, author, category)
- POST /api/posts — Create post (protected). Body: title, content, category, tags[], status, featuredImage
- PUT /api/posts/:id — Update post (protected & owner/admin)
- DELETE /api/posts/:id — Delete post (protected & owner/admin)

Categories
- GET /api/categories — Get categories
- GET /api/categories/:id — Get single category
- POST /api/categories — Create category (admin)
- PUT /api/categories/:id — Update category (admin)
- DELETE /api/categories/:id — Delete category (admin)

Comments
- GET /api/comments/post/:postId — Get comments for a post
- POST /api/comments — Create comment (protected). Body: content, post
- PUT /api/comments/:id — Update comment (protected & owner/admin)
- DELETE /api/comments/:id — Delete comment (protected & owner/admin)

Notes: The API returns a JSON object with `success`, and `data` (or `message`/`errors` on failure).

---

## Features implemented (high-level)

- User registration, login, and JWT-based protected routes
- Full CRUD for posts and categories
- Post list with pagination, search and category filtering
- Single post view with comments (comments are loaded and created via API)
- Optimistic UI updates for comment posting and deletion
- Create/Edit post forms with client/server validation
- Responsive UI using Tailwind CSS
- Image upload server-side dependencies (Cloudinary + multer) are configured; client integration optional

---

## How to contribute / extend

- Add a client-side upload field in `CreatePost.jsx` and wire it to an upload API endpoint, or include images in the post create payload.
- Add unit tests to `client/` (Jest + React Testing Library) and `server/` (mocha/jest + supertest).
- Add CI workflow to run tests and linting on PRs.

---

## Extras added in this branch

- Client-side Cloudinary upload flow: `POST /api/uploads` implemented server-side (`server/routes/uploads.js`) and client helper `uploadAPI.uploadImage` in `client/src/services/api.js`. `CreatePost.jsx` and `EditPost.jsx` now include upload UI, preview and wiring to set `featuredImage` automatically.
- OpenAPI spec: `openapi.yaml` at repo root documents the main API endpoints.
- Postman collection: `postman_collection.json` for manual testing and import into Postman.
- Tests: Basic server tests using Jest + Supertest in `server/tests` and a simple client Jest test in `client/src/components/__tests__`.
- CI workflow: `.github/workflows/ci.yml` runs server and client tests on push/PR to `main`.

---

## Screenshots

Add screenshots to `docs/` or inline here. Example placeholders below — replace with real images/screenshots:

Below are the screenshots used in this repository. They are referenced from the `docs/` folder. If the images are not present yet, save the attached screenshots into the `docs/` folder with the filenames shown below.

![Homepage screenshot](./docs/screenshot-home.png)

![Features screenshot](./docs/screenshot-features.png)

![Create post screenshot](./docs/screenshot-create.png)

![Posts list screenshot](./docs/screenshot-posts.png)

How to add the actual image files

1. Create a `docs` directory at the repo root (if it doesn't already exist):

```powershell
mkdir .\docs
```

2. Save the four screenshot image files into `docs/` with these exact filenames:
- `screenshot-home.png`
- `screenshot-features.png`
- `screenshot-create.png`
- `screenshot-posts.png`

3. Commit the images to the repo:

```powershell
git add docs/screenshot-*.png
git commit -m "Add README screenshots"
git push
```

If you'd like, I can add the images for you if you upload them here or point me to their file paths. Otherwise follow the steps above and the images will render in the README.

---

## Final notes

This codebase is a working, educational MERN application. It includes most of the requested features and is a good foundation to extend for production (add proper security hardening, tests, CI/CD, and image upload UX improvements).

If you want, I can:
- Implement the client-side image upload flow that uses Cloudinary and show an example in `CreatePost.jsx`.
- Add an OpenAPI/Swagger spec for the API.
- Add automated tests and a CI workflow.

---

Author: Paul Siameto
Repository: PLP-MERN-Stack-Development/mern-stack-integration-Paul-Siameto
