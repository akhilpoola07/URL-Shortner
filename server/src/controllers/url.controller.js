const UrlService = require('../services/url.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getBaseUrl } = require('../config/appUrl');

class UrlController {
    static async createUrl(req, res, next) {
        try {
            const { originalUrl, title, customAlias } = req.body;

            if (!originalUrl) {
                return sendError(res, 400, 'Original URL is required.');
            }

            const userId = req.user.id;
            const urlRecord = await UrlService.createUrl({
                userId,
                originalUrl,
                title,
                customAlias,
            });

            const shortUrl = `${getBaseUrl()}/${urlRecord.short_code}`;

            return sendSuccess(res, 201, 'Short URL created successfully.', {
                ...urlRecord,
                shortUrl,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUrls(req, res, next) {
        try {
            const userId = req.user.id;
            const { search, sortBy, order, page, limit } = req.query;

            const result = await UrlService.getUserUrls(userId, {
                search,
                sortBy,
                order,
                page,
                limit,
            });

            const baseUrl = getBaseUrl();
            const formattedUrls = result.urls.map((u) => ({
                ...u,
                shortUrl: `${baseUrl}/${u.short_code}`,
            }));

            return sendSuccess(res, 200, 'URLs retrieved successfully.', {
                urls: formattedUrls,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUrlById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const urlRecord = await UrlService.getUrlById(id, userId);
            const shortUrl = `${getBaseUrl()}/${urlRecord.short_code}`;

            return sendSuccess(res, 200, 'URL details retrieved successfully.', {
                ...urlRecord,
                shortUrl,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateUrl(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { title, customAlias } = req.body;

            const updated = await UrlService.updateUrl(id, userId, { title, customAlias });
            const shortUrl = `${getBaseUrl()}/${updated.short_code}`;

            return sendSuccess(res, 200, 'URL updated successfully.', {
                ...updated,
                shortUrl,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteUrl(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            await UrlService.deleteUrl(id, userId);

            return sendSuccess(res, 200, 'URL deleted successfully.');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UrlController;
