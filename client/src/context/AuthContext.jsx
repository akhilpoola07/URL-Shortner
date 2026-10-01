import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await authApi.getCurrentUser();
            if (response.success) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (_) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        if (response.success) {
            setUser(response.data.user);
            if (response.data.token) {
                localStorage.setItem('linkshort_token', response.data.token);
            }
        }
        return response;
    };

    const register = async (userData) => {
        const response = await authApi.register(userData);
        if (response.success) {
            setUser(response.data.user);
            if (response.data.token) {
                localStorage.setItem('linkshort_token', response.data.token);
            }
        }
        return response;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (_) {
            // Ignore error on logout call
        } finally {
            setUser(null);
            localStorage.removeItem('linkshort_token');
        }
    };

    const updateProfile = async (data) => {
        const response = await authApi.updateProfile(data);
        if (response.success) {
            setUser(response.data.user);
            if (response.data.token) {
                localStorage.setItem('linkshort_token', response.data.token);
            }
        }
        return response;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                updateProfile,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
