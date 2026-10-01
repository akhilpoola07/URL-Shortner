import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 2rem' }}>
                The page or link you are looking for does not exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
                <Home size={18} /> Return to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
