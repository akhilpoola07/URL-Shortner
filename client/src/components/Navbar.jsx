import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, Sun, Moon, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="container nav-container">
                <Link to="/" className="brand-logo">
                    <Link2 size={28} />
                    <span>LinkShort</span>
                </Link>

                <div className="nav-actions">
                    <button
                        onClick={toggleTheme}
                        className="btn btn-secondary btn-sm"
                        aria-label="Toggle dark mode"
                        title="Toggle dark/light mode"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="btn btn-secondary btn-sm">
                                <LayoutDashboard size={16} />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/dashboard/settings" className="btn btn-secondary btn-sm" title="Account settings">
                                <User size={16} />
                                <span>{user?.name || 'Profile'}</span>
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">
                                Log In
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Get Started Free
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
