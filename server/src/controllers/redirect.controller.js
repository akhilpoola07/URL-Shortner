const UrlService = require('../services/url.service');

class RedirectController {
    static async handleRedirect(req, res, next) {
        try {
            const { shortCode } = req.params;

            const urlRecord = await UrlService.getUrlByShortCode(shortCode);

            if (!urlRecord) {
                // If requested with Accept: application/json, return JSON 404
                if (req.headers.accept && req.headers.accept.includes('application/json')) {
                    return res.status(404).json({
                        success: false,
                        message: 'Short link not found or has been deleted.',
                    });
                }

                // Render clean HTML 404 page for browser requests
                return res.status(404).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>404 - Link Not Found | LinkShort</title>
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; }
                            .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); max-width: 420px; border: 1px solid #334155; }
                            h1 { color: #f43f5e; font-size: 2.5rem; margin-bottom: 0.5rem; }
                            p { color: #94a3b8; font-size: 1rem; margin-bottom: 1.5rem; }
                            a { display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: background 0.2s; }
                            a:hover { background: #2563eb; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h1>404</h1>
                            <p>The shortened link you opened does not exist or may have been deleted.</p>
                            <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}">Go to Home Page</a>
                        </div>
                    </body>
                    </html>
                `);
            }

            // Asynchronously or inline record click and update counter
            await UrlService.recordClick(urlRecord.id);

            // 302 Found redirect
            return res.redirect(302, urlRecord.original_url);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RedirectController;
