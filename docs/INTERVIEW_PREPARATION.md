# Technical Interview Preparation Guide

## 1. Project Pitches

### 30-Second Elevator Pitch
"I built **LinkShort**, a full-stack SaaS URL Shortener web application using React, Node.js/Express, and PostgreSQL. It allows users to convert long links into customizable short codes, track real-time click analytics with visual charts, and handle fast HTTP 302 redirects. It implements secure JWT authentication, password hashing with bcrypt, rate limiting, and SQL injection protection."

### 1-Minute Project Summary
"LinkShort addresses the need for clean link management and campaign click tracking. The frontend is built with React.js and Vite, offering a light and dark mode dashboard with interactive Recharts analytics graphs. The backend is an Express.js REST API connected to a PostgreSQL relational database. When a visitor hits a short code, the server looks up the URL in PostgreSQL, atomically increments the click counter, logs a timestamped click event, and redirects the visitor in milliseconds. Security is enforced through JWT HTTP-only cookies, password hashing with bcrypt, rate limiting, input validation, and user link isolation."

---

## 2. Technology Choices & Rationale
- **React.js & Vite**: Fast development, component-based modular UI, lightweight bundle size.
- **Express.js & Node.js**: High performance, non-blocking I/O ideal for handling concurrent HTTP redirects.
- **PostgreSQL & `pg`**: Relational database integrity, strong indexing support, atomic update capability for link counts.
- **Recharts**: Responsive SVG charting library for React to visualize click trends over time.
- **JWT & bcryptjs**: Stateless authorization and industry-standard salted password hashing.

---

## 3. 25 Interview Questions & Answers

1. **How does URL redirection work?**  
   The client requests `GET /:shortCode`. The backend extracts `shortCode`, queries PostgreSQL for `original_url`, increments clicks, and returns an HTTP `302 Found` header with `Location: <original_url>`.

2. **Why use HTTP 302 instead of 301 redirect?**  
   HTTP 301 is permanent, causing browsers to cache the redirect locally and skip sending future requests to our server, missing analytics clicks. 302 is temporary, forcing browsers to ping our server every time.

3. **How do you prevent SQL Injection?**  
   By using parameterized queries (`$1, $2`) provided by the `pg` driver rather than string concatenation.

4. **How are passwords stored securely?**  
   Passwords are never stored in plain text. They are hashed using `bcryptjs` with 10 salt rounds before database insertion.

5. **What is JWT and how does it work in LinkShort?**  
   JSON Web Token (JWT) is a digitally signed token containing payload claims (user ID, email). Upon login, the server signs a token and returns it in an HTTP-only cookie or Bearer header.

6. **Why use HTTP-only cookies for storing JWTs?**  
   HTTP-only cookies cannot be accessed by client-side JavaScript (`document.cookie`), mitigating Cross-Site Scripting (XSS) token theft.

7. **How do you handle custom alias collisions?**  
   Custom aliases must be unique. The backend checks `SELECT id FROM urls WHERE short_code = $1`. If found, it returns `409 Conflict`.

8. **What prevents users from choosing reserved words as short codes?**  
   A predefined Set of reserved routes (`api`, `login`, `register`, `dashboard`, `settings`, `health`) is checked during alias validation.

9. **How do you update click counts atomically?**  
   Using single atomic SQL statements `UPDATE urls SET clicks = clicks + 1 WHERE id = $1` instead of reading into JS memory and saving back.

10. **How does click activity over time get recorded?**  
    Every redirect inserts a row into `click_events (url_id, clicked_at)`. Analytics endpoints run SQL `GROUP BY TO_CHAR(clicked_at, 'YYYY-MM-DD')` to compute daily counts.

11. **How do you enforce user data isolation?**  
    All CRUD operations filter by `user_id = req.user.id`. Accessing another user's link returns `403 Forbidden` or `404 Not Found`.

12. **What is the purpose of foreign key cascade deletion (`ON DELETE CASCADE`)?**  
    If a user or link is deleted, PostgreSQL automatically deletes all associated URLs and click events.

13. **How is rate limiting implemented?**  
    `express-rate-limit` tracks IP requests per time window (e.g. max 20 login attempts per 15 min, max 30 link creations per min).

14. **How is open redirect vulnerability prevented?**  
    Destination URLs are validated to accept only `http://` or `https://` protocols, blocking malicious `javascript:` or internal network URIs.

15. **What is Helmet.js used for?**  
    Helmet sets security HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) to secure the Express app.

16. **Why use Vite over Create React App?**  
    Vite uses ES modules during development, providing instant server start and lightning-fast Hot Module Replacement (HMR).

17. **How does Light/Dark mode toggle work in LinkShort?**  
    `ThemeContext` toggles a `data-theme="dark"` attribute on the `<html>` root node, altering CSS custom property variables.

18. **How are backend API errors formatted?**  
    With a standard JSON structure `{ success: false, message: '...' }` and appropriate HTTP status codes (400, 401, 403, 404, 409, 429, 500).

19. **How are frontend form validation errors handled?**  
    Forms validate inputs before sending requests (email regex, password length min 8, password match) to reduce unnecessary server load.

20. **What database indexes are created and why?**  
    Indexes on `users(email)`, `urls(short_code)`, `urls(user_id)`, and `click_events(url_id)` to speed up `JOIN` and `WHERE` lookup operations.

21. **How does the search and filter feature work in My Links?**  
    The backend uses `ILIKE` wildcard search `AND (title ILIKE $1 OR original_url ILIKE $1 OR short_code ILIKE $1)` with `LIMIT` and `OFFSET`.

22. **What unit and integration testing strategy is used?**  
    Jest and Supertest execute automated integration tests covering authentication, link creation, alias collisions, redirection, and authorization.

23. **How do you test the backend without a live PostgreSQL server?**  
    Using `pg-mem`, an in-memory SQL database mock that runs instantly in Jest without network overhead.

24. **How is the app deployed?**  
    Frontend on Vercel/Netlify, backend on Render/Fly.io, and PostgreSQL on Supabase/Neon/Render Postgres.

25. **What are potential future enhancements?**  
    Adding QR code generation for short links, expiration dates on links, link password protection, and geographical visitor tracking.
