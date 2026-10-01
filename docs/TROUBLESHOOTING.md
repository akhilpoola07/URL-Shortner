# Troubleshooting Guide

## 1. PostgreSQL Connection Refused
**Symptom**: `error: connect ECONNREFUSED 127.0.0.1:5432` or `Failed to connect to PostgreSQL`.
**Solutions**:
- Verify PostgreSQL service is running: `docker compose up -d` or `brew services start postgresql@15`.
- Check `DATABASE_URL` in `.env` matches credentials (`postgresql://linkshort_user:linkshort_password@localhost:5432/linkshort_db`).

## 2. Port Already in Use (Port 5000 or 5173)
**Symptom**: `Error: listen EADDRINUSE: address already in use :::5000`.
**Solutions**:
- Kill process using port 5000: `lsof -i :5000` then `kill -9 <PID>`.
- Change `PORT=5001` in `.env` and `VITE_API_BASE_URL=http://localhost:5001/api` in client.

## 3. CORS Error on Frontend Requests
**Symptom**: `Access to XMLHttpRequest at 'http://localhost:5000/api' from origin 'http://localhost:5173' has been blocked by CORS policy`.
**Solutions**:
- Ensure `CLIENT_ORIGIN=http://localhost:5173` in backend `.env`.
- Ensure `withCredentials: true` is configured on Axios instance.

## 4. Invalid or Expired JWT Token
**Symptom**: `401 Unauthorized: Session expired. Please log in again`.
**Solutions**:
- Log out and log back in to get a fresh token.
- Clear browser cookies or `localStorage.removeItem('linkshort_token')`.

## 5. Database Schema Not Initialized
**Symptom**: `error: relation "users" does not exist`.
**Solutions**:
- Run schema script: `psql -U linkshort_user -d linkshort_db -f database/schema.sql`.

## 6. Frontend API Connection Failure
**Symptom**: Network Error or 404 on API calls.
**Solutions**:
- Check backend server is running on port 5000 (`http://localhost:5000/api/health`).
- Verify `VITE_API_BASE_URL` matches the running server URL.
