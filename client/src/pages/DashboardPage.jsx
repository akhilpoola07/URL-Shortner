import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, MousePointerClick, TrendingUp, PlusCircle, ExternalLink, Copy, Check, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { analyticsApi } from '../api/analyticsApi';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const DashboardPage = () => {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedCode, setCopiedCode] = useState('');
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const res = await analyticsApi.getOverview();
            if (res.success) {
                setOverview(res.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard overview data.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, code) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(code);
        setToast({ message: 'Short URL copied to clipboard!', type: 'success' });
        setTimeout(() => setCopiedCode(''), 2500);
    };

    if (loading) {
        return <LoadingSpinner message="Loading your dashboard analytics..." />;
    }

    if (error) {
        return (
            <div style={{ padding: '2rem 0' }}>
                <Toast message={error} type="error" onClose={() => setError('')} />
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error}</p>
                    <button className="btn btn-primary" onClick={fetchOverview} style={{ marginTop: '1rem' }}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { totalUrls = 0, totalClicks = 0, mostClickedUrl, recentUrls = [], clickActivity = [] } = overview || {};

    return (
        <div>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

            {/* Dashboard Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time performance metrics and link activity</p>
                </div>

                <Link to="/dashboard/create" className="btn btn-primary">
                    <PlusCircle size={18} /> Shorten New Link
                </Link>
            </div>

            {/* Summary Stats Grid */}
            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon-wrapper">
                        <Link2 size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{totalUrls}</div>
                        <div className="stat-label">Total Shortened Links</div>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                        <MousePointerClick size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{totalClicks}</div>
                        <div className="stat-label">Total Click Engagement</div>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value" style={{ fontSize: '1.2rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                            {mostClickedUrl ? `${mostClickedUrl.clicks} clicks` : 'None'}
                        </div>
                        <div className="stat-label">
                            {mostClickedUrl ? `Top Link: /${mostClickedUrl.short_code}` : 'No Clicks Yet'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recharts Analytics Chart */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart2 size={20} style={{ color: 'var(--accent-primary)' }} />
                    Click Activity Over Time (Last 14 Days)
                </h3>

                {clickActivity && clickActivity.length > 0 ? (
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={clickActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
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
                                <Area type="monotone" dataKey="clicks" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No click activity recorded in the last 14 days. Share your links to track analytics!
                    </div>
                )}
            </div>

            {/* Recently Created Links */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recently Created Links</h3>
                    <Link to="/dashboard/links" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        View All Links &rarr;
                    </Link>
                </div>

                {recentUrls.length > 0 ? (
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Title / Original URL</th>
                                    <th>Short Link</th>
                                    <th>Clicks</th>
                                    <th>Created Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUrls.map((url) => (
                                    <tr key={url.id}>
                                        <td style={{ maxWidth: '280px' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {url.title || 'Untitled Link'}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {url.original_url}
                                            </div>
                                        </td>
                                        <td>
                                            <a href={url.shortUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                                                {url.short_code}
                                            </a>
                                        </td>
                                        <td>
                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', backgroundColor: 'var(--bg-tertiary)', fontWeight: 600, fontSize: '0.85rem' }}>
                                                {url.clicks}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {new Date(url.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => copyToClipboard(url.shortUrl, url.short_code)}
                                                    className="btn btn-secondary btn-sm"
                                                    title="Copy link"
                                                >
                                                    {copiedCode === url.short_code ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                                                </button>
                                                <Link to={`/dashboard/analytics/${url.id}`} className="btn btn-secondary btn-sm" title="View analytics">
                                                    <BarChart2 size={14} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                        No shortened links yet.{' '}
                        <Link to="/dashboard/create" style={{ fontWeight: 600 }}>
                            Create one now &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
