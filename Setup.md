# Setup

## Prerequisites

- .NET SDK 8
- Node.js 20+
- SQL Server 2022 (or Docker)

## Backend

1. Configure `src/API/appsettings.Development.json`.
2. Run `dotnet restore ProductManagementSystem.sln`.
3. Run `dotnet run --project src/API/API.csproj`.

## Frontend

1. Create `.env` in repository root:

```
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

2. Install and run:

```
npm install
npm run dev
```

## Tests

`dotnet test ProductManagementSystem.sln`