import axios from 'axios';

/**
 * API base URL:
 * - Development: set VITE_API_BASE_URL=http://localhost:5000/api in client/.env
 *   (or use /api and rely on the Vite proxy in vite.config.js)
 * - Production (Railway single service): defaults to /api on the same domain
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Authorization Bearer token from localStorage as fallback if cookies aren't used
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('linkshort_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
