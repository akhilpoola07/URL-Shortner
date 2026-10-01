import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, BarChart2, ShieldCheck, Zap, ArrowRight, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const LandingPage = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [toast, setToast] = useState({ message: '', type: '' });
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleShorten = (e) => {
        e.preventDefault();
        if (!originalUrl) {
            setToast({ message: 'Please enter a valid URL', type: 'error' });
            return;
        }

        let formattedUrl = originalUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'https://' + formattedUrl;
        }

        if (isAuthenticated) {
            navigate('/dashboard/create', { state: { initialUrl: formattedUrl } });
        } else {
            setToast({ message: 'Please log in or register to shorten and save your URLs!', type: 'info' });
            setTimeout(() => {
                navigate('/register', { state: { initialUrl: formattedUrl } });
            }, 1200);
        }
    };

    return (
        <div>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

            {/* Hero Section */}
            <section className="hero-section container">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '2rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    <Zap size={16} /> Fast & Secure SaaS Link Shortener
                </div>

                <h1 className="hero-title">
                    Shorten Links. Track Clicks.<br />Share Anywhere.
                </h1>

                <p className="hero-subtitle">
                    Transform long, unwieldy web addresses into clean, memorable, high-converting links with real-time visitor analytics.
                </p>

                {/* Hero Form */}
                <form onSubmit={handleShorten} style={{ maxWidth: '640px', margin: '0 auto 3rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="input-control"
                        placeholder="Paste a long URL (e.g. https://example.com/very-long-path)..."
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        style={{ flex: 1, minWidth: '280px', padding: '0.875rem 1rem', fontSize: '1rem' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
                        Shorten URL <ArrowRight size={18} />
                    </button>
                </form>
            </section>

            {/* Feature Cards */}
            <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Everything you need for link management</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
                            Designed for modern workflows, developers, and data science portfolios.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="card">
                            <div className="stat-icon-wrapper" style={{ marginBottom: '1.25rem' }}>
                                <Link2 size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Custom Aliases</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                Create unique, branded short codes that match your brand or campaign identity.
                            </p>
                        </div>

                        <div className="card">
                            <div className="stat-icon-wrapper" style={{ marginBottom: '1.25rem' }}>
                                <BarChart2 size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Click Analytics</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                Track total clicks and daily interaction trends over time with visual Recharts graphs.
                            </p>
                        </div>

                        <div className="card">
                            <div className="stat-icon-wrapper" style={{ marginBottom: '1.25rem' }}>
                                <ShieldCheck size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Secure & Isolated</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                Password hashing with bcrypt, JWT authorization, rate limiting, and SQL injection protection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="container" style={{ padding: '5rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>How LinkShort Works</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Get started in 3 simple steps</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    <div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>1</div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Paste Your Link</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter any valid HTTP or HTTPS destination web address.</p>
                    </div>

                    <div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>2</div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Customize & Shorten</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Optionally set a custom alias and title for better organization.</p>
                    </div>

                    <div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>3</div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Share & Analyze</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Share your link across social media or emails and track clicks in real-time.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
