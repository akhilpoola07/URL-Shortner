/**
 * Resolve the public base URL used when generating short links.
 * Prefer APP_BASE_URL; fall back to Railway's public domain, then localhost.
 */
const getBaseUrl = () => {
    if (process.env.APP_BASE_URL) {
        return process.env.APP_BASE_URL.replace(/\/$/, '');
    }

    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        return `https://${process.env.RAILWAY_PUBLIC_DOMAIN.replace(/\/$/, '')}`;
    }

    const port = process.env.PORT || 5000;
    return `http://localhost:${port}`;
};

module.exports = { getBaseUrl };
