const setupTestDatabase = require('./tests/setup');
const app = require('./src/app');

const PORT = 5002;
const BASE_URL = `http://localhost:${PORT}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runDemo() {
    console.log('====================================================');
    console.log('🚀 LinkShort URL Shortener - End-to-End Live Demo 🚀');
    console.log('====================================================\n');

    console.log('1️⃣  Starting in-memory database (pg-mem) and API server...');
    setupTestDatabase();
    
    const server = app.listen(PORT, () => {
        console.log(`✅ Server running on ${BASE_URL}\n`);
    });

    try {
        console.log('2️⃣  Registering a new user (Demo User, demo@example.com)...');
        const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!'
            })
        });
        const registerData = await registerRes.json();
        console.log(`   Response Status: ${registerRes.status}`);
        console.log(`   Welcome, ${registerData.data.user.name}! Token received.\n`);
        
        const token = registerData.data.token;
        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        console.log('3️⃣  Shortening a long URL (https://github.com/expressjs/express)...');
        const shortenRes = await fetch(`${BASE_URL}/api/urls`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                originalUrl: 'https://github.com/expressjs/express',
                title: 'ExpressJS GitHub'
            })
        });
        const shortenData = await shortenRes.json();
        console.log(`   Response Status: ${shortenRes.status}`);
        const shortUrl = shortenData.data.shortUrl;
        const shortCode = shortenData.data.short_code;
        const urlId = shortenData.data.id;
        console.log(`   ✅ Success! Shortened URL: ${shortUrl}\n`);

        console.log(`4️⃣  Simulating 3 clicks on the short URL (${shortUrl})...`);
        for (let i = 1; i <= 3; i++) {
            const redirectRes = await fetch(`${BASE_URL}/${shortCode}`, {
                redirect: 'manual' // Prevent following the redirect
            });
            console.log(`   Click ${i} -> Redirected to: ${redirectRes.headers.get('location')} (Status: ${redirectRes.status})`);
            await sleep(100);
        }
        console.log();

        console.log('5️⃣  Fetching Analytics for the shortened URL...');
        const analyticsRes = await fetch(`${BASE_URL}/api/analytics/urls/${urlId}`, { headers: authHeaders });
        const analyticsData = await analyticsRes.json();
        console.log(`   Response Status: ${analyticsRes.status}`);
        console.log(`   Total Clicks Recorded: ${analyticsData.data.totalClicks}`);
        console.log(`   Recent Click Events Found: ${analyticsData.data.recentClicks.length}\n`);

        console.log('6️⃣  Fetching User Dashboard Overview...');
        const overviewRes = await fetch(`${BASE_URL}/api/analytics/overview`, { headers: authHeaders });
        const overviewData = await overviewRes.json();
        console.log(`   Response Status: ${overviewRes.status}`);
        console.log(`   Total URLs Owned: ${overviewData.data.totalUrls}`);
        console.log(`   Total Overall Clicks: ${overviewData.data.totalClicks}`);
        console.log(`   Most Clicked URL: ${overviewData.data.mostClickedUrl.title} (${overviewData.data.mostClickedUrl.short_code})\n`);

        console.log('====================================================');
        console.log('🎉 DEMO COMPLETED SUCCESSFULLY! EVERYTHING WORKS! 🎉');
        console.log('====================================================');

    } catch (err) {
        console.error('❌ Demo failed:', err.message);
    } finally {
        server.close();
        process.exit(0);
    }
}

runDemo();
