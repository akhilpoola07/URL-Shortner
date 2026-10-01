const db = require('../config/db');
const { generateShortCode } = require('../utils/shortCode');
const { isValidHttpUrl, isValidAlias } = require('../utils/urlValidator');

class UrlService {
    /**
     * Create a new shortened URL
     */
    static async createUrl({ userId, originalUrl, title, customAlias }) {
        if (!isValidHttpUrl(originalUrl)) {
            const error = new Error('Invalid URL format. Must start with http:// or https://');
            error.statusCode = 400;
            throw error;
        }

        let shortCode;
        if (customAlias && customAlias.trim() !== '') {
            const cleanAlias = customAlias.trim();
            if (!isValidAlias(cleanAlias)) {
                const error = new Error('Invalid custom alias. Must be 3-30 alphanumeric characters and not a system reserved word.');
                error.statusCode = 400;
                throw error;
            }

            // Check collision
            const existing = await db.query('SELECT id FROM urls WHERE short_code = $1', [cleanAlias]);
            if (existing.rows.length > 0) {
                const error = new Error('This custom alias is already in use. Please choose another.');
                error.statusCode = 409;
                throw error;
            }
            shortCode = cleanAlias;
        } else {
            // Generate unique short code
            let isUnique = false;
            let attempts = 0;
            while (!isUnique && attempts < 5) {
                const code = generateShortCode(7);
                const existing = await db.query('SELECT id FROM urls WHERE short_code = $1', [code]);
                if (existing.rows.length === 0) {
                    shortCode = code;
                    isUnique = true;
                }
                attempts++;
            }
            if (!isUnique) {
                const error = new Error('Could not generate unique short code. Please try again.');
                error.statusCode = 500;
                throw error;
            }
        }

        const finalTitle = title && title.trim() !== '' ? title.trim() : originalUrl;

        const result = await db.query(
            `INSERT INTO urls (user_id, title, original_url, short_code)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, title, original_url, short_code, clicks, created_at, updated_at`,
            [userId, finalTitle, originalUrl, shortCode]
        );

        return result.rows[0];
    }

    /**
     * Get list of URLs for a user with optional search, sorting, and pagination
     */
    static async getUserUrls(userId, { search, sortBy = 'created_at', order = 'DESC', page = 1, limit = 10 } = {}) {
        const offset = (page - 1) * limit;
        const validSortFields = ['created_at', 'clicks', 'title'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        let queryText = 'SELECT id, user_id, title, original_url, short_code, clicks, created_at, updated_at FROM urls WHERE user_id = $1';
        let countQueryText = 'SELECT COUNT(*) FROM urls WHERE user_id = $1';
        const params = [userId];

        if (search && search.trim() !== '') {
            const searchTerm = `%${search.trim()}%`;
            params.push(searchTerm);
            queryText += ` AND (title ILIKE $${params.length} OR original_url ILIKE $${params.length} OR short_code ILIKE $${params.length})`;
            countQueryText += ` AND (title ILIKE $${params.length} OR original_url ILIKE $${params.length} OR short_code ILIKE $${params.length})`;
        }

        queryText += ` ORDER BY ${sortField} ${sortOrder} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

        const countResult = await db.query(countQueryText, params);
        const totalItems = parseInt(countResult.rows[0].count, 10);

        const queryParams = [...params, limit, offset];
        const result = await db.query(queryText, queryParams);

        return {
            urls: result.rows,
            pagination: {
                totalItems,
                currentPage: parseInt(page, 10),
                totalPages: Math.ceil(totalItems / limit) || 1,
                limit: parseInt(limit, 10),
            },
        };
    }

    /**
     * Get single URL by ID ensuring ownership
     */
    static async getUrlById(id, userId) {
        const result = await db.query(
            'SELECT id, user_id, title, original_url, short_code, clicks, created_at, updated_at FROM urls WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            const error = new Error('URL not found.');
            error.statusCode = 404;
            throw error;
        }

        const urlRecord = result.rows[0];

        if (urlRecord.user_id !== userId) {
            const error = new Error('Access denied. You do not own this link.');
            error.statusCode = 403;
            throw error;
        }

        return urlRecord;
    }

    /**
     * Look up URL by short code for redirection
     */
    static async getUrlByShortCode(shortCode) {
        const result = await db.query(
            'SELECT id, original_url, short_code FROM urls WHERE short_code = $1',
            [shortCode]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    }

    /**
     * Record a click event and atomically increment click count
     */
    static async recordClick(urlId) {
        // Atomic transaction or sequential safe queries
        await db.query(
            'UPDATE urls SET clicks = clicks + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
            [urlId]
        );
        await db.query(
            'INSERT INTO click_events (url_id, clicked_at) VALUES ($1, CURRENT_TIMESTAMP)',
            [urlId]
        );
    }

    /**
     * Update URL title or custom alias
     */
    static async updateUrl(id, userId, { title, customAlias }) {
        const urlRecord = await this.getUrlById(id, userId);

        let newShortCode = urlRecord.short_code;
        if (customAlias && customAlias.trim() !== '' && customAlias.trim() !== urlRecord.short_code) {
            const cleanAlias = customAlias.trim();
            if (!isValidAlias(cleanAlias)) {
                const error = new Error('Invalid custom alias format.');
                error.statusCode = 400;
                throw error;
            }
            const existing = await db.query('SELECT id FROM urls WHERE short_code = $1 AND id != $2', [cleanAlias, id]);
            if (existing.rows.length > 0) {
                const error = new Error('Custom alias is already taken.');
                error.statusCode = 409;
                throw error;
            }
            newShortCode = cleanAlias;
        }

        const newTitle = title !== undefined ? title.trim() : urlRecord.title;

        const result = await db.query(
            `UPDATE urls
             SET title = $1, short_code = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 AND user_id = $4
             RETURNING id, user_id, title, original_url, short_code, clicks, created_at, updated_at`,
            [newTitle, newShortCode, id, userId]
        );

        return result.rows[0];
    }

    /**
     * Delete a URL ensuring ownership
     */
    static async deleteUrl(id, userId) {
        // Ownership check
        await this.getUrlById(id, userId);

        await db.query('DELETE FROM urls WHERE id = $1 AND user_id = $2', [id, userId]);
        return { deleted: true };
    }
}

module.exports = UrlService;
