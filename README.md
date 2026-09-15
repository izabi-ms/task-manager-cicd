# Task Manager

A production-oriented full-stack task management application built with React, Vite, Node.js, Express, PostgreSQL, and Docker Compose. It supports task creation, listing, editing, status changes, filtering, and deletion.

## Project structure

```text
task-manager/
├── backend/
│   ├── src/
│   │   ├── db.js
│   │   ├── routes.js
│   │   ├── server.js
│   │   └── validation.js
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

## Run with Docker Compose

Requirements: Docker Desktop or Docker Engine with the Compose plugin.

1. Copy `.env.example` to `.env` if you want to customize credentials.
2. Start all services:

```bash
docker compose up --build
```

3. Open the frontend at [http://localhost:8080](http://localhost:8080). The API is available at [http://localhost:5000/api](http://localhost:5000/api).
4. Stop the services with `docker compose down`. Add `-v` only when you intentionally want to remove the PostgreSQL data volume.

The database initialization script runs automatically on the first database-volume creation.

## Local development

Start PostgreSQL separately, create the database using `database/init.sql`, and set `DATABASE_URL` in `backend/.env`. Then run:

```bash
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:5000/api` in `frontend/.env` for local frontend development.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List tasks |
| GET | `/api/tasks/:id` | Retrieve one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Replace a task |
| PATCH | `/api/tasks/:id/status` | Change task status |
| DELETE | `/api/tasks/:id` | Delete a task |

Task statuses are `pending`, `in_progress`, and `completed`. Titles are required and limited to 120 characters.

## Notes

- PostgreSQL data persists in the `postgres_data` Docker volume.
- The frontend uses the build-time `VITE_API_URL` value.
- For production deployment, place the frontend and API behind HTTPS and provide strong database credentials through a secrets manager.
