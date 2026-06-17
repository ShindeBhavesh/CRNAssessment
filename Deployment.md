# Deployment

## Docker Compose

`docker compose up --build -d`

Services:

- SQL Server: `localhost:1433`
- API: `http://localhost:8080`
- Frontend: `http://localhost:5173`

## Environment Variables

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__AccessTokenMinutes`
- `Jwt__RefreshTokenDays`

## Health Check

`GET /health`