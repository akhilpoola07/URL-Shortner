const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const jwtConfig = require('../config/jwt');

class AuthService {
    /**
     * Register a new user
     */
    static async register({ name, email, password }) {
        const normalizedEmail = email.trim().toLowerCase();

        // Check if email already exists
        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
        if (existingUser.rows.length > 0) {
            const error = new Error('An account with this email address already exists.');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert user
        const result = await db.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [name.trim(), normalizedEmail, passwordHash]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return { user, token };
    }

    /**
     * Authenticate existing user
     */
    static async login({ email, password }) {
        const normalizedEmail = email.trim().toLowerCase();

        const result = await db.query(
            'SELECT id, name, email, password_hash FROM users WHERE email = $1',
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            const error = new Error('Invalid email address or password.');
            error.statusCode = 401;
            throw error;
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            const error = new Error('Invalid email address or password.');
            error.statusCode = 401;
            throw error;
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }

    /**
     * Get user profile by ID
     */
    static async getUserById(userId) {
        const result = await db.query(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        return result.rows[0];
    }

    /**
     * Update user profile
     */
    static async updateProfile(userId, { name }) {
        const result = await db.query(
            `UPDATE users
             SET name = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, name, email, created_at, updated_at`,
            [name.trim(), userId]
        );

        if (result.rows.length === 0) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        const user = result.rows[0];
        // Generate updated token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return { user, token };
    }
}

module.exports = AuthService;
