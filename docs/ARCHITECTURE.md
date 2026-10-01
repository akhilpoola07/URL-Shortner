# System Architecture

## Architecture Overview
LinkShort follows a clean multi-tier SaaS architecture with clear separation of concerns:

```
[ Client (React + Vite) ] <--- HTTP REST & Cookies ---> [ Server (Express.js) ] <--- SQL ---> [ PostgreSQL Database ]
```

### 1. Frontend Layer (React.js + Vite)
- Built with React 18, React Router 6, Axios, Recharts, and Lucide React icons.
- State Management: React Context API (`AuthContext` for user session, `ThemeContext` for light/dark mode).
- UI/UX: Fully responsive SaaS layout with sidebar navigation, empty states, modals, and toasts.

### 2. Backend API Layer (Node.js + Express.js)
- RESTful HTTP routes.
- Controller-Service-Repository pattern.
- Middleware stack: `helmet` for security headers, `cors` for cross-origin access control, `express-rate-limit` for rate limiting, `cookie-parser` & JWT for session verification.

### 3. Database Layer (PostgreSQL)
- Relational schema with primary keys, foreign keys (`ON DELETE CASCADE`), unique constraints, and B-Tree performance indexes.
- Parameterized SQL queries using the `pg` client to guarantee SQL injection safety.

### 4. Redirection & Click Tracking Flow
```
Visitor opens GET /abc123
        │
        ▼
Extract shortCode "abc123"
        │
        ▼
Query database for matching short_code
        │
  ├─── Code Not Found ───► Return HTML/JSON 404
        │
  └─── Code Found
        │
        ├─► Atomically UPDATE urls SET clicks = clicks + 1
        ├─► INSERT INTO click_events (url_id, clicked_at)
        └─► Return HTTP 302 Redirect to original_url
```
