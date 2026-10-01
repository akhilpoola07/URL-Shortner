# API Guide

## Base URL
Local Development: `http://localhost:5000/api`

## Response Format
All API endpoints return JSON using a consistent structure:

Success Response (200 / 201):
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

Error Response (400 / 401 / 403 / 404 / 409 / 429 / 500):
```json
{
  "success": false,
  "message": "Detailed error message"
}
```

## Endpoints Reference Table

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | No | Server health status check |
| `POST` | `/api/auth/register` | No | Register new user account |
| `POST` | `/api/auth/login` | No | Authenticate user and issue JWT |
| `GET` | `/api/auth/me` | Yes | Get authenticated user profile |
| `POST` | `/api/auth/logout` | Yes | Invalidate user session / cookie |
| `PATCH` | `/api/auth/profile` | Yes | Update user profile name |
| `POST` | `/api/urls` | Yes | Create a new short URL |
| `GET` | `/api/urls` | Yes | List user URLs (with search, sort, pagination) |
| `GET` | `/api/urls/:id` | Yes | Get single URL details |
| `PATCH` | `/api/urls/:id` | Yes | Update URL title or custom alias |
| `DELETE` | `/api/urls/:id` | Yes | Delete a short URL |
| `GET` | `/api/analytics/overview` | Yes | Get total URLs, clicks, and activity timeline |
| `GET` | `/api/analytics/urls/:id` | Yes | Get detailed daily analytics for a link |
| `GET` | `/:shortCode` | No | Public endpoint to redirect short code to original URL |
