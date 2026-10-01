import axiosInstance from './axiosInstance';

export const authApi = {
    register: async (data) => {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
    },
    login: async (data) => {
        const response = await axiosInstance.post('/auth/login', data);
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    },
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await axiosInstance.patch('/auth/profile', data);
        return response.data;
    },
};
