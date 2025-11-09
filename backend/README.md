# PracticalVault — Backend

This folder contains the backend for PracticalVault — a MERN app for managing and sharing practicals.

Quick start

1. Copy `.env.example` to `.env` and set your `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

   cd backend
   npm install

3. Run locally:

   npm run dev

API endpoints

- POST /api/auth/login — admin login (returns JWT)
- GET /api/subjects — public list of subjects
- POST /api/subjects — create subject (protected)
- PUT /api/subjects/:id — update subject (protected)
- DELETE /api/subjects/:id — delete subject (protected)
- GET /api/practicals/subject/:id — list practicals for a subject
- POST /api/practicals — create practical (protected)
- PUT /api/practicals/:id — update practical (protected)
- DELETE /api/practicals/:id — delete practical (protected)

Notes

- Uses JWT for admin authentication and bcrypt for password hashing.
- Add an initial admin manually (seed) or create an endpoint later to register admins.
