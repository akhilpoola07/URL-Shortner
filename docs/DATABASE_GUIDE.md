# Database Guide & Schema Design

## Overview
LinkShort uses PostgreSQL to store user accounts, shortened URL mappings, and click interaction events.

## Entity-Relationship Diagram

```
+-------------------+        1 : N        +-------------------+        1 : N        +-------------------+
|       users       | ------------------< |       urls        | ------------------< |   click_events    |
+-------------------+                     +-------------------+                     +-------------------+
| id (PK)           |                     | id (PK)           |                     | id (PK)           |
| name              |                     | user_id (FK)      |                     | url_id (FK)       |
| email (UNIQUE)    |                     | title             |                     | clicked_at        |
| password_hash     |                     | original_url      |                     +-------------------+
| created_at        |                     | short_code (UQ)   |
| updated_at        |                     | clicks            |
+-------------------+                     | created_at        |
                                          | updated_at        |
                                          +-------------------+
```

## Table Specifications

### 1. `users` Table
Stores registered application users.
- `id` (SERIAL PRIMARY KEY): Unique auto-incrementing integer user ID.
- `name` (VARCHAR(100)): Full name of user.
- `email` (VARCHAR(255) UNIQUE): Email address used for login. Indexed.
- `password_hash` (VARCHAR(255)): Bcrypt password hash (never plain text).

### 2. `urls` Table
Stores original long URLs and their mapped short codes.
- `id` (SERIAL PRIMARY KEY): Unique link ID.
- `user_id` (INTEGER FK): Foreign key referencing `users(id)` with `ON DELETE CASCADE`.
- `short_code` (VARCHAR(30) UNIQUE): The short alias or random code. Indexed.
- `original_url` (TEXT): Full target URL.
- `clicks` (INTEGER): Atomic click counter.

### 3. `click_events` Table
Stores timestamped click logs for daily analytics charts.
- `id` (BIGSERIAL PRIMARY KEY): Unique click event ID.
- `url_id` (INTEGER FK): References `urls(id)` with `ON DELETE CASCADE`.
- `clicked_at` (TIMESTAMPTZ): Timestamp when redirect occurred. Indexed.

## Performance Indexes
- `idx_users_email`: Speeds up login lookups (`WHERE email = $1`).
- `idx_urls_user_id`: Fast retrieval of user links (`WHERE user_id = $1`).
- `idx_urls_short_code`: High-speed redirect lookups (`WHERE short_code = $1`).
- `idx_click_events_url_id`: Efficient click aggregation (`WHERE url_id = $1`).
