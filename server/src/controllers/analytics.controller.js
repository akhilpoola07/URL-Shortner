const AnalyticsService = require('../services/analytics.service');
const { sendSuccess } = require('../utils/responseHandler');
const { getBaseUrl } = require('../config/appUrl');

class AnalyticsController {
    static async getUrlAnalytics(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const analytics = await AnalyticsService.getUrlAnalytics(id, userId);
            const baseUrl = getBaseUrl();

            analytics.url.shortUrl = `${baseUrl}/${analytics.url.short_code}`;

            return sendSuccess(res, 200, 'Link analytics retrieved successfully.', analytics);
        } catch (error) {
            next(error);
        }
    }

    static async getOverviewAnalytics(req, res, next) {
        try {
            const userId = req.user.id;
            const overview = await AnalyticsService.getOverviewAnalytics(userId);
            const baseUrl = getBaseUrl();

            if (overview.mostClickedUrl) {
                overview.mostClickedUrl.shortUrl = `${baseUrl}/${overview.mostClickedUrl.short_code}`;
            }

            overview.recentUrls = overview.recentUrls.map((u) => ({
                ...u,
                shortUrl: `${baseUrl}/${u.short_code}`,
            }));

            return sendSuccess(res, 200, 'Overview analytics retrieved successfully.', overview);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AnalyticsController;
