-- LinkShort Development Seed Data
-- Demo user password is: Password123! (bcrypt hash below)

INSERT INTO users (name, email, password_hash)
VALUES (
    'Demo User',
    'demo@example.com',
    '$2a$10$7vN3lM8GfLq9wG2vO3kQe.UjT8mE9xJ1eB8wN7vO3kQe.UjT8mE9x'
) ON CONFLICT (email) DO NOTHING;

-- Sample URLs for Demo User
INSERT INTO urls (user_id, title, original_url, short_code, clicks, created_at)
SELECT 
    u.id,
    'GitHub Repository',
    'https://github.com',
    'github-demo',
    15,
    NOW() - INTERVAL '5 days'
FROM users u WHERE u.email = 'demo@example.com'
ON CONFLICT (short_code) DO NOTHING;

INSERT INTO urls (user_id, title, original_url, short_code, clicks, created_at)
SELECT 
    u.id,
    'PostgreSQL Documentation',
    'https://www.postgresql.org/docs/',
    'pg-docs',
    8,
    NOW() - INTERVAL '3 days'
FROM users u WHERE u.email = 'demo@example.com'
ON CONFLICT (short_code) DO NOTHING;

INSERT INTO urls (user_id, title, original_url, short_code, clicks, created_at)
SELECT 
    u.id,
    'React JS Official Site',
    'https://react.dev',
    'react-dev',
    23,
    NOW() - INTERVAL '1 day'
FROM users u WHERE u.email = 'demo@example.com'
ON CONFLICT (short_code) DO NOTHING;

-- Sample Click Events
INSERT INTO click_events (url_id, clicked_at)
SELECT id, NOW() - INTERVAL '4 days' FROM urls WHERE short_code = 'github-demo';

INSERT INTO click_events (url_id, clicked_at)
SELECT id, NOW() - INTERVAL '2 days' FROM urls WHERE short_code = 'github-demo';

INSERT INTO click_events (url_id, clicked_at)
SELECT id, NOW() - INTERVAL '12 hours' FROM urls WHERE short_code = 'react-dev';

INSERT INTO click_events (url_id, clicked_at)
SELECT id, NOW() - INTERVAL '2 hours' FROM urls WHERE short_code = 'react-dev';
