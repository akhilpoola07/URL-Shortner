import axiosInstance from './axiosInstance';

export const analyticsApi = {
    getOverview: async () => {
        const response = await axiosInstance.get('/analytics/overview');
        return response.data;
    },
    getUrlAnalytics: async (id) => {
        const response = await axiosInstance.get(`/analytics/urls/${id}`);
        return response.data;
    },
};
