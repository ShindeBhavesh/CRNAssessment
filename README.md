# Product Management System

Enterprise-ready full stack application with React + TypeScript frontend and .NET 8 Clean Architecture backend.

## Stack

- Frontend: React, TypeScript, Vite, Material UI, Redux Toolkit, React Query, Axios, React Router
- Backend: .NET 8, ASP.NET Core Web API, EF Core, SQL Server, MediatR, AutoMapper, FluentValidation, Serilog
- Security: JWT access tokens, refresh token rotation, role-based authorization
- DevOps: Docker, Docker Compose, GitHub Actions
- Testing: xUnit, Moq, FluentAssertions, WebApplicationFactory

## Repository Structure

- `src/API`
- `src/Application`
- `src/Domain`
- `src/Infrastructure`
- `src` (frontend)
- `tests/API.Tests`
- `tests/Application.Tests`
- `tests/Infrastructure.Tests`

## Local Run

1. Start SQL Server (Docker): `docker compose up -d sqlserver`
2. Run backend: `dotnet run --project src/API/API.csproj`
3. Run frontend: `npm install && npm run dev`

Set frontend env:

```
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Docker

`docker compose up --build`

Frontend: `http://localhost:5173`

Backend Swagger: `http://localhost:8080/swagger`

## Default Credentials

- Admin: `admin@pms.local` / `Admin@123`

## Documents

- `Architecture.md`
- `Setup.md`
- `Deployment.md`
- `API.md`
- `Database.md`
- `AuthenticationFlow.md`
- `PostmanCollection.json`