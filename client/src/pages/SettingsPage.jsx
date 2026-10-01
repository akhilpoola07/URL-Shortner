import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Sun, Moon, LogOut, Save, Shield } from 'lucide-react';
import Toast from '../components/Toast';

const SettingsPage = () => {
    const { user, updateProfile, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });

    const handleUpdateName = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setToast({ message: 'Name cannot be empty.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const res = await updateProfile({ name: name.trim() });
            if (res.success) {
                setToast({ message: 'Profile updated successfully!', type: 'success' });
            }
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile & Settings</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Manage your account details and interface preferences
                </p>
            </div>

            {/* Account Details Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={20} style={{ color: 'var(--accent-primary)' }} />
                    Account Information
                </h3>

                <form onSubmit={handleUpdateName}>
                    <div className="input-group">
                        <label htmlFor="userEmail">Email Address (Read-only)</label>
                        <input
                            id="userEmail"
                            type="email"
                            className="input-control"
                            value={user?.email || ''}
                            disabled
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="userName">Full Name</label>
                        <input
                            id="userName"
                            type="text"
                            className="input-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                        <Save size={16} /> {loading ? 'Saving...' : 'Update Name'}
                    </button>
                </form>
            </div>

            {/* Appearance Preferences Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {theme === 'dark' ? <Moon size={20} style={{ color: 'var(--accent-primary)' }} /> : <Sun size={20} style={{ color: 'var(--warning)' }} />}
                    Interface Theme
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            {theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Switch between dark and light SaaS dashboard styling
                        </div>
                    </div>

                    <button onClick={toggleTheme} className="btn btn-secondary">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                </div>
            </div>

            {/* Logout Card */}
            <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--danger)' }}>
                    Session Security
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                    End your active session securely.
                </p>

                <button onClick={logout} className="btn btn-outline-danger btn-sm">
                    <LogOut size={16} /> Sign Out of Account
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
