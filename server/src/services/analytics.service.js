const db = require('../config/db');
const UrlService = require('./url.service');

class AnalyticsService {
    /**
     * Get analytics for a specific URL owned by the user
     */
    static async getUrlAnalytics(urlId, userId) {
        // Ownership check
        const urlRecord = await UrlService.getUrlById(urlId, userId);

        // Daily click breakdown (last 30 days)
        const dailyClicksQuery = `
            SELECT 
                TO_CHAR(clicked_at, 'YYYY-MM-DD') AS date,
                COUNT(*)::INTEGER AS clicks
            FROM click_events
            WHERE url_id = $1 AND clicked_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
            GROUP BY TO_CHAR(clicked_at, 'YYYY-MM-DD')
            ORDER BY date ASC
        `;
        const dailyResult = await db.query(dailyClicksQuery, [urlId]);

        // Recent click events (last 10 clicks)
        const recentClicksQuery = `
            SELECT id, clicked_at
            FROM click_events
            WHERE url_id = $1
            ORDER BY clicked_at DESC
            LIMIT 10
        `;
        const recentResult = await db.query(recentClicksQuery, [urlId]);

        return {
            url: urlRecord,
            totalClicks: urlRecord.clicks,
            dailyClicks: dailyResult.rows,
            recentClicks: recentResult.rows,
        };
    }

    /**
     * Get user dashboard overview analytics
     */
    static async getOverviewAnalytics(userId) {
        // 1. Total URLs & Total Clicks
        const statsQuery = `
            SELECT 
                COUNT(*)::INTEGER AS total_urls,
                COALESCE(SUM(clicks), 0)::INTEGER AS total_clicks
            FROM urls
            WHERE user_id = $1
        `;
        const statsResult = await db.query(statsQuery, [userId]);
        const { total_urls: totalUrls, total_clicks: totalClicks } = statsResult.rows[0];

        // 2. Most Clicked URL
        const topUrlQuery = `
            SELECT id, title, original_url, short_code, clicks, created_at
            FROM urls
            WHERE user_id = $1
            ORDER BY clicks DESC, created_at DESC
            LIMIT 1
        `;
        const topUrlResult = await db.query(topUrlQuery, [userId]);
        const mostClickedUrl = topUrlResult.rows[0] || null;

        // 3. Recently Created Links (last 5)
        const recentUrlsQuery = `
            SELECT id, title, original_url, short_code, clicks, created_at
            FROM urls
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 5
        `;
        const recentUrlsResult = await db.query(recentUrlsQuery, [userId]);

        // 4. Click activity graph data (last 14 days) across all user links
        const clickTimelineQuery = `
            SELECT 
                TO_CHAR(ce.clicked_at, 'YYYY-MM-DD') AS date,
                COUNT(*)::INTEGER AS clicks
            FROM click_events ce
            JOIN urls u ON ce.url_id = u.id
            WHERE u.user_id = $1 AND ce.clicked_at >= CURRENT_TIMESTAMP - INTERVAL '14 days'
            GROUP BY TO_CHAR(ce.clicked_at, 'YYYY-MM-DD')
            ORDER BY date ASC
        `;
        const clickTimelineResult = await db.query(clickTimelineQuery, [userId]);

        return {
            totalUrls,
            totalClicks,
            mostClickedUrl,
            recentUrls: recentUrlsResult.rows,
            clickActivity: clickTimelineResult.rows,
        };
    }
}

module.exports = AnalyticsService;
