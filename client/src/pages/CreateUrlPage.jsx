import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { urlApi } from '../api/urlApi';
import Toast from '../components/Toast';

const CreateUrlPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialUrl = location.state?.initialUrl || '';

    const [originalUrl, setOriginalUrl] = useState(initialUrl);
    const [title, setTitle] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [createdResult, setCreatedResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast({ message: '', type: '' });
        setCreatedResult(null);

        if (!originalUrl.trim()) {
            setToast({ message: 'Please enter an original URL.', type: 'error' });
            return;
        }

        let formattedUrl = originalUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'https://' + formattedUrl;
        }

        setLoading(true);
        try {
            const res = await urlApi.createUrl({
                originalUrl: formattedUrl,
                title: title.trim(),
                customAlias: customAlias.trim(),
            });

            if (res.success) {
                setCreatedResult(res.data);
                setToast({ message: 'Short URL created successfully!', type: 'success' });
            }
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to create short URL.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!createdResult?.shortUrl) return;
        navigator.clipboard.writeText(createdResult.shortUrl);
        setCopied(true);
        setToast({ message: 'Copied to clipboard!', type: 'success' });
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div className="stat-icon-wrapper">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Shorten a New URL</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Convert long web addresses into concise, trackable short links
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="originalUrl">Original Long URL *</label>
                        <input
                            id="originalUrl"
                            type="url"
                            className="input-control"
                            placeholder="https://example.com/long-page-path-name"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="title">Link Title (Optional)</label>
                        <input
                            id="title"
                            type="text"
                            className="input-control"
                            placeholder="e.g. My Portfolio Project Link"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="customAlias">Custom Short Alias (Optional)</label>
                        <input
                            id="customAlias"
                            type="text"
                            className="input-control"
                            placeholder="e.g. my-custom-link (3-30 chars)"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value)}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Letters, numbers, hyphens, and underscores allowed. Leave empty to auto-generate.
                        </span>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Shortening URL...' : 'Shorten Link'}
                    </button>
                </form>
            </div>

            {/* Display Generated Short Link Result */}
            {createdResult && (
                <div className="card" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)', animation: 'slideIn 0.3s ease-out' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={20} /> URL Shortened Successfully!
                    </h3>

                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your Shortened Link</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                className="input-control"
                                value={createdResult.shortUrl}
                                readOnly
                                style={{ fontWeight: 600, backgroundColor: 'var(--bg-secondary)' }}
                            />
                            <button type="button" className="btn btn-primary" onClick={copyToClipboard}>
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <a href={createdResult.shortUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                            Test Short Link <ExternalLink size={14} />
                        </a>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                                setOriginalUrl('');
                                setTitle('');
                                setCustomAlias('');
                                setCreatedResult(null);
                            }}
                        >
                            Shorten Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateUrlPage;
