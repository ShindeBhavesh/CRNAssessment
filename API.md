# API Endpoints

Base URL: `/api/v1`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

## Products

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`

## Items

- `GET /items`
- `GET /items/{id}`
- `POST /items`
- `PUT /items/{id}`
- `DELETE /items/{id}`

All product/item endpoints require JWT bearer token.