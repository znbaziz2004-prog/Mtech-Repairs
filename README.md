# Mtech & Repairs Limited — Website

Full-stack website for Mtech & Repairs Limited (mobile device repair, buy & sell, accessories, diagnostics).

## Structure
- `frontend/` — React (Vite) client app
- `backend/` — Node.js + Express API
- `database/` — MongoDB schema/seed reference (Mongoose models live in backend/src/models, this folder holds raw seed/reference SQL-NoSQL docs + ER notes)

## Run locally

### Backend
```
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```
