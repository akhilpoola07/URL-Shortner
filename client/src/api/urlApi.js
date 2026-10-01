import axiosInstance from './axiosInstance';

export const urlApi = {
    createUrl: async (data) => {
        const response = await axiosInstance.post('/urls', data);
        return response.data;
    },
    getUrls: async (params = {}) => {
        const response = await axiosInstance.get('/urls', { params });
        return response.data;
    },
    getUrlById: async (id) => {
        const response = await axiosInstance.get(`/urls/${id}`);
        return response.data;
    },
    updateUrl: async (id, data) => {
        const response = await axiosInstance.patch(`/urls/${id}`, data);
        return response.data;
    },
    deleteUrl: async (id) => {
        const response = await axiosInstance.delete(`/urls/${id}`);
        return response.data;
    },
};
