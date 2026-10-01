import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Copy, Check, ExternalLink, BarChart2, Trash2, PlusCircle, ArrowUpDown } from 'lucide-react';
import { urlApi } from '../api/urlApi';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

const MyLinksPage = () => {
    const [urls, setUrls] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [order, setOrder] = useState('DESC');
    const [page, setPage] = useState(1);
    
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState('');
    const [toast, setToast] = useState({ message: '', type: '' });

    // Modal state for link deletion
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, urlId: null, title: '' });
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchUrls();
    }, [search, sortBy, order, page]);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            const res = await urlApi.getUrls({
                search,
                sortBy,
                order,
                page,
                limit: 8,
            });

            if (res.success) {
                setUrls(res.data.urls);
                setPagination(res.data.pagination);
            }
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to fetch links.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (shortUrl, code) => {
        navigator.clipboard.writeText(shortUrl);
        setCopiedCode(code);
        setToast({ message: 'Short URL copied!', type: 'success' });
        setTimeout(() => setCopiedCode(''), 2500);
    };

    const openDeleteModal = (url) => {
        setDeleteModal({
            isOpen: true,
            urlId: url.id,
            title: url.title || url.short_code,
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.urlId) return;

        setDeleteLoading(true);
        try {
            const res = await urlApi.deleteUrl(deleteModal.urlId);
            if (res.success) {
                setToast({ message: 'Link deleted successfully.', type: 'success' });
                setDeleteModal({ isOpen: false, urlId: null, title: '' });
                fetchUrls();
            }
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to delete link.', type: 'error' });
        } finally {
            setDeleteLoading(false);
        }
    };

    const toggleSortOrder = (field) => {
        if (sortBy === field) {
            setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
        } else {
            setSortBy(field);
            setOrder('DESC');
        }
    };

    return (
        <div>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, urlId: null, title: '' })}
                onConfirm={confirmDelete}
                title="Delete Link"
                message={`Are you sure you want to delete "${deleteModal.title}"? All analytics associated with this link will be permanently removed.`}
                confirmText="Delete Link"
                confirmVariant="danger"
                loading={deleteLoading}
            />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Links</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Manage, track, and search your shortened URLs
                    </p>
                </div>

                <Link to="/dashboard/create" className="btn btn-primary">
                    <PlusCircle size={18} /> Create Short Link
                </Link>
            </div>

            {/* Search and Sort Toolbar */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input-control"
                            placeholder="Search by title, original URL, or alias..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
                        <button
                            className={`btn btn-secondary btn-sm ${sortBy === 'created_at' ? 'active' : ''}`}
                            onClick={() => toggleSortOrder('created_at')}
                        >
                            Date {sortBy === 'created_at' ? (order === 'ASC' ? '↑' : '↓') : ''}
                        </button>
                        <button
                            className={`btn btn-secondary btn-sm ${sortBy === 'clicks' ? 'active' : ''}`}
                            onClick={() => toggleSortOrder('clicks')}
                        >
                            Clicks {sortBy === 'clicks' ? (order === 'ASC' ? '↑' : '↓') : ''}
                        </button>
                    </div>
                </div>
            </div>

            {/* Links Table */}
            {loading ? (
                <LoadingSpinner message="Fetching your links..." />
            ) : urls.length > 0 ? (
                <div className="card">
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Title & Destination</th>
                                    <th>Short Code</th>
                                    <th>Clicks</th>
                                    <th>Created</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {urls.map((url) => (
                                    <tr key={url.id}>
                                        <td style={{ maxWidth: '320px' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {url.title || 'Untitled Link'}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <a href={url.original_url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                                                    {url.original_url}
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <a href={url.shortUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                                                    /{url.short_code}
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ padding: '0.25rem 0.625rem', borderRadius: '1rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                                                {url.clicks} clicks
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {new Date(url.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleCopy(url.shortUrl, url.short_code)}
                                                    className="btn btn-secondary btn-sm"
                                                    title="Copy short URL"
                                                >
                                                    {copiedCode === url.short_code ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                                                </button>
                                                <a
                                                    href={url.original_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-secondary btn-sm"
                                                    title="Open original URL"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                                <Link
                                                    to={`/dashboard/analytics/${url.id}`}
                                                    className="btn btn-secondary btn-sm"
                                                    title="View detailed analytics"
                                                >
                                                    <BarChart2 size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => openDeleteModal(url)}
                                                    className="btn btn-outline-danger btn-sm"
                                                    title="Delete link"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} links total)
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={pagination.currentPage === 1}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <EmptyState
                    title="No links found"
                    description={search ? `No links matching "${search}". Try clearing your search filter.` : 'You have not created any shortened links yet.'}
                    actionLink="/dashboard/create"
                    actionText="Create Short Link"
                />
            )}
        </div>
    );
};

export default MyLinksPage;
