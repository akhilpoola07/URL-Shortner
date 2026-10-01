import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const validateForm = () => {
        const errs = {};
        if (!name.trim()) errs.name = 'Full name is required';
        if (!email.trim()) {
            errs.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errs.email = 'Invalid email address format';
        }

        if (!password) {
            errs.password = 'Password is required';
        } else if (password.length < 8) {
            errs.password = 'Password must be at least 8 characters long';
        }

        if (password !== confirmPassword) {
            errs.confirmPassword = 'Passwords do not match';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await register({ name, email, password, confirmPassword });
            if (response.success) {
                const targetPath = location.state?.from?.pathname || '/dashboard';
                navigate(targetPath, { replace: true });
            } else {
                setApiError(response.message || 'Registration failed');
            }
        } catch (err) {
            setApiError(err.response?.data?.message || 'Server connection error during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 150px)' }}>
            <Toast message={apiError} type="error" onClose={() => setApiError('')} />

            <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <UserPlus size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create Your Account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Start shortening links and tracking detailed analytics
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            className="input-control"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.name}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="input-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.email}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password (min 8 chars)</label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
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

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="input-control"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register Account'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ fontWeight: 600 }}>
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
