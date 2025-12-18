// API Configuration
// Automatically detect if running locally or in production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080/api'
    : 'https://expense-tracker-backend-bxuv.onrender.com/api';

// API Endpoints
const API = {
    categories: {
        getAll: () => `${API_BASE_URL}/categories`,
        getById: (id) => `${API_BASE_URL}/categories/${id}`,
        create: () => `${API_BASE_URL}/categories`,
        update: (id) => `${API_BASE_URL}/categories/${id}`,
        delete: (id) => `${API_BASE_URL}/categories/${id}`
    },
    expenses: {
        getAll: (params) => {
            const url = new URL(`${API_BASE_URL}/expenses`);
            if (params) {
                Object.keys(params).forEach(key => {
                    if (params[key]) url.searchParams.append(key, params[key]);
                });
            }
            return url.toString();
        },
        getById: (id) => `${API_BASE_URL}/expenses/${id}`,
        create: () => `${API_BASE_URL}/expenses`,
        update: (id) => `${API_BASE_URL}/expenses/${id}`,
        delete: (id) => `${API_BASE_URL}/expenses/${id}`
    },
    analytics: {
        monthly: (month, year) => `${API_BASE_URL}/analytics/monthly?month=${month}&year=${year}`,
        breakdown: (month, year) => `${API_BASE_URL}/analytics/breakdown?month=${month}&year=${year}`,
        stats: () => `${API_BASE_URL}/analytics/stats`
    },
    chat: {
        send: () => `${API_BASE_URL}/chat`
    }
};

