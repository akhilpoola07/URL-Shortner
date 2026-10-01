import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', gap: '0.75rem' }}>
            <div className="spinner" style={{ width: size === 'small' ? '20px' : size === 'large' ? '40px' : '28px', height: size === 'small' ? '20px' : size === 'large' ? '40px' : '28px' }} />
            {message && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</span>}
        </div>
    );
};

export default LoadingSpinner;
