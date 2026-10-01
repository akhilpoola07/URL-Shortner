const request = require('supertest');
const setupTestDatabase = require('./setup');

let app;

beforeAll(() => {
    setupTestDatabase();
    app = require('../src/app');
});

describe('LinkShort Backend API Automated Test Suite', () => {
    let user1Token;
    let user1Id;
    let user2Token;
    let user2Id;
    let createdUrlId;
    let createdShortCode;

    describe('Health Check Endpoint', () => {
        test('GET /api/health should return 200 OK', async () => {
            const res = await request(app).get('/api/health');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('uptime');
        });
    });

    describe('Authentication Endpoints', () => {
        test('POST /api/auth/register with valid data should create user and return token', async () => {
            const res = await request(app).post('/api/auth/register').send({
                name: 'Alice Developer',
                email: 'alice@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user).toHaveProperty('email', 'alice@example.com');
            expect(res.body.data).toHaveProperty('token');

            user1Token = res.body.data.token;
            user1Id = res.body.data.user.id;
        });

        test('POST /api/auth/register with duplicate email should fail (409)', async () => {
            const res = await request(app).post('/api/auth/register').send({
                name: 'Alice Duplicate',
                email: 'alice@example.com',
                password: 'Password123!',
            });

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });

        test('POST /api/auth/login with correct credentials should succeed', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'alice@example.com',
                password: 'Password123!',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
        });

        test('POST /api/auth/login with incorrect password should fail (401)', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'alice@example.com',
                password: 'WrongPassword!',
            });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test('GET /api/auth/me without authentication should fail (401)', async () => {
            const res = await request(app).get('/api/auth/me');
            expect(res.status).toBe(401);
        });

        test('GET /api/auth/me with valid Bearer token should return profile', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${user1Token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.user.email).toBe('alice@example.com');
        });

        // Register second user for ownership isolation tests
        test('Register User 2 for access control testing', async () => {
            const res = await request(app).post('/api/auth/register').send({
                name: 'Bob Analyst',
                email: 'bob@example.com',
                password: 'Password123!',
            });
            user2Token = res.body.data.token;
            user2Id = res.body.data.user.id;
        });
    });

    describe('URL Shortening Management', () => {
        test('POST /api/urls should create short URL with auto-generated code', async () => {
            const res = await request(app)
                .post('/api/urls')
                .set('Authorization', `Bearer ${user1Token}`)
                .send({
                    originalUrl: 'https://github.com/expressjs/express',
                    title: 'ExpressJS GitHub',
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('short_code');
            expect(res.body.data).toHaveProperty('shortUrl');

            createdUrlId = res.body.data.id;
            createdShortCode = res.body.data.short_code;
        });

        test('POST /api/urls should reject invalid URL format (400)', async () => {
            const res = await request(app)
                .post('/api/urls')
                .set('Authorization', `Bearer ${user1Token}`)
                .send({
                    originalUrl: 'not-a-valid-url-protocol',
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('POST /api/urls with custom alias should succeed', async () => {
            const res = await request(app)
                .post('/api/urls')
                .set('Authorization', `Bearer ${user1Token}`)
                .send({
                    originalUrl: 'https://react.dev',
                    title: 'React Docs',
                    customAlias: 'react-official',
                });

            expect(res.status).toBe(201);
            expect(res.body.data.short_code).toBe('react-official');
        });

        test('POST /api/urls with duplicate custom alias should fail (409)', async () => {
            const res = await request(app)
                .post('/api/urls')
                .set('Authorization', `Bearer ${user1Token}`)
                .send({
                    originalUrl: 'https://react.dev/blog',
                    customAlias: 'react-official',
                });

            expect(res.status).toBe(409);
        });

        test('GET /api/urls should return only current user\'s URLs', async () => {
            const res = await request(app)
                .get('/api/urls')
                .set('Authorization', `Bearer ${user1Token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.urls.length).toBeGreaterThanOrEqual(2);
        });

        test('GET /api/urls/:id preventing User 2 from accessing User 1\'s URL (403)', async () => {
            const res = await request(app)
                .get(`/api/urls/${createdUrlId}`)
                .set('Authorization', `Bearer ${user2Token}`);

            expect(res.status).toBe(403);
        });
    });

    describe('Redirection and Click Tracking', () => {
        test('GET /:shortCode should redirect (302) to original URL and record click', async () => {
            const res = await request(app).get(`/${createdShortCode}`);
            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('https://github.com/expressjs/express');
        });

        test('GET /:shortCode with missing/non-existent code should return 404', async () => {
            const res = await request(app)
                .get('/non-existent-code-999')
                .set('Accept', 'application/json');

            expect(res.status).toBe(404);
        });
    });

    describe('Analytics Endpoints', () => {
        test('GET /api/analytics/urls/:id should aggregate clicks', async () => {
            const res = await request(app)
                .get(`/api/analytics/urls/${createdUrlId}`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.totalClicks).toBeGreaterThanOrEqual(1);
            expect(res.body.data).toHaveProperty('dailyClicks');
        });

        test('GET /api/analytics/overview should return total URLs and click activity', async () => {
            const res = await request(app)
                .get('/api/analytics/overview')
                .set('Authorization', `Bearer ${user1Token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.totalUrls).toBeGreaterThanOrEqual(2);
            expect(res.body.data.totalClicks).toBeGreaterThanOrEqual(1);
        });
    });

    describe('URL Deletion', () => {
        test('DELETE /api/urls/:id should remove URL', async () => {
            const res = await request(app)
                .delete(`/api/urls/${createdUrlId}`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(res.status).toBe(200);

            // Verify it is gone
            const getRes = await request(app)
                .get(`/api/urls/${createdUrlId}`)
                .set('Authorization', `Bearer ${user1Token}`);
            expect(getRes.status).toBe(404);
        });
    });
});
