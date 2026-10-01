import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, ExternalLink, MousePointerClick, Calendar, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { analyticsApi } from '../api/analyticsApi';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const AnalyticsPage = () => {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => {
        if (id) {
            fetchAnalytics();
        }
    }, [id]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await analyticsApi.getUrlAnalytics(id);
            if (res.success) {
                setAnalytics(res.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch analytics for this link.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!analytics?.url?.shortUrl) return;
        navigator.clipboard.writeText(analytics.url.shortUrl);
        setCopied(true);
        setToast({ message: 'Short URL copied!', type: 'success' });
        setTimeout(() => setCopied(false), 2500);
    };

    if (loading) {
        return <LoadingSpinner message="Fetching detailed link analytics..." />;
    }

    if (error) {
        return (
            <div>
                <Link to="/dashboard/links" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
                    <ArrowLeft size={16} /> Back to My Links
                </Link>
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error}</p>
                </div>
            </div>
        );
    }

    const { url, totalClicks = 0, dailyClicks = [], recentClicks = [] } = analytics || {};

    return (
        <div>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

            <Link to="/dashboard/links" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
                <ArrowLeft size={16} /> Back to My Links
            </Link>

            {/* Link Header Card */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                            {url?.title || 'Link Analytics'}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', wordBreak: 'break-all' }}>
                            Destination: <a href={url?.original_url} target="_blank" rel="noreferrer">{url?.original_url}</a>
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={copyToClipboard} className="btn btn-secondary btn-sm">
                            {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy Link'}</span>
                        </button>
                        <a href={url?.original_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                            Visit Site <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                    <div>
                        <span style={{ color: 'var(--text-muted)' }}>Short URL: </span>
                        <a href={url?.shortUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>
                            {url?.shortUrl}
                        </a>
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)' }}>Created On: </span>
                        <span style={{ fontWeight: 600 }}>{new Date(url?.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                        <MousePointerClick size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{totalClicks}</div>
                        <div className="stat-label">Total Clicks Recorded</div>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-wrapper">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{dailyClicks.length}</div>
                        <div className="stat-label">Active Days (Last 30 Days)</div>
                    </div>
                </div>
            </div>

            {/* Recharts Daily Clicks Graph */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart2 size={20} style={{ color: 'var(--accent-primary)' }} />
                    Daily Clicks Trend (Last 30 Days)
                </h3>

                {dailyClicks && dailyClicks.length > 0 ? (
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyClicks} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderColor: 'var(--border-color)',
                                        color: 'var(--text-primary)',
                                        borderRadius: '0.5rem',
                                    }}
                                />
                                <Area type="monotone" dataKey="clicks" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorDaily)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No clicks recorded for this link yet. Share the link to start collecting analytics data!
                    </div>
                )}
            </div>

            {/* Recent Click Event History */}
            <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Recent Click Event Log
                </h3>

                {recentClicks && recentClicks.length > 0 ? (
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Event ID</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentClicks.map((click) => (
                                    <tr key={click.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>#{click.id}</td>
                                        <td>{new Date(click.clicked_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No recent click events.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
