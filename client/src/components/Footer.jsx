import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '3rem 0 1.5rem', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ maxWidth: '320px' }}>
                    <div className="brand-logo" style={{ marginBottom: '0.75rem' }}>
                        <Link2 size={24} />
                        <span>LinkShort</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Fast, reliable, and secure URL shortener built for AI & Data Science portfolio projects. Track link analytics with ease.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '3rem' }}>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Product</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <li><Link to="/login" style={{ color: 'var(--text-secondary)' }}>Login</Link></li>
                            <li><Link to="/register" style={{ color: 'var(--text-secondary)' }}>Register</Link></li>
                            <li><Link to="/dashboard" style={{ color: 'var(--text-secondary)' }}>Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Resources</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <li><a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Github size={14} /> GitHub Repo</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                &copy; {new Date().getFullYear()} LinkShort URL Shortener. Built with React, Express, and PostgreSQL.
            </div>
        </footer>
    );
};

export default Footer;
