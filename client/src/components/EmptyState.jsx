import React from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

const EmptyState = ({
    title = 'No links found',
    description = 'You have not created any shortened URLs yet. Get started by creating your first link!',
    actionLink = '/dashboard/create',
    actionText = 'Shorten a URL',
    icon: Icon = Link2
}) => {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                <Icon size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
                {description}
            </p>
            {actionLink && actionText && (
                <Link to={actionLink} className="btn btn-primary">
                    {actionText}
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
