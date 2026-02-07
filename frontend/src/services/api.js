/**
 * Axios API service for backend communication
 * Handles all HTTP requests with automatic token injection
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    signup: (data) => api.post('/api/auth/signup', data),
    login: (data) => api.post('/api/auth/login', data),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/api/user/profile'),
    updateProfile: (data) => api.put('/api/user/profile', data),
};

// Food API
export const foodAPI = {
    addManual: (data) => api.post('/api/food/manual', data),
    uploadImage: (formData) => api.post('/api/food/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getLogs: (date) => api.get('/api/food/logs', { params: { date } }),
};

// Activity API
export const activityAPI = {
    add: (data) => api.post('/api/activity', data),
    getLogs: (date) => api.get('/api/activity/logs', { params: { date } }),
};

// Goals API
export const goalsAPI = {
    set: (data) => api.post('/api/goals', data),
    get: (date) => api.get('/api/goals', { params: { date } }),
};

// Dashboard API
export const dashboardAPI = {
    getSummary: (date) => api.get('/api/dashboard/summary', { params: { date } }),
};

export default api;
