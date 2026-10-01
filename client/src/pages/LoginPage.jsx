import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const validateForm = () => {
        const errs = {};
        if (!email.trim()) errs.email = 'Email address is required';
        if (!password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await login({ email, password });
            if (response.success) {
                const targetPath = location.state?.from?.pathname || '/dashboard';
                navigate(targetPath, { replace: true });
            } else {
                setApiError(response.message || 'Invalid email or password.');
            }
        } catch (err) {
            setApiError(err.response?.data?.message || 'Invalid credentials or server error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 150px)' }}>
            <Toast message={apiError} type="error" onClose={() => setApiError('')} />

            <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <LogIn size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Log in to manage your shortened links and analytics
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="login-email">Email Address</label>
                        <input
                            id="login-email"
                            type="email"
                            className="input-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.email}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                className="input-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.password}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Don't have an account yet?{' '}
                    <Link to="/register" style={{ fontWeight: 600 }}>
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
