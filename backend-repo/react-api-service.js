// api.js - React API Service for NETRA News Platform

import axios from 'axios';

// Base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
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
      // Token expired or invalid - redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Authentication ====================

export const authAPI = {
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== Articles ====================

export const articlesAPI = {
  getArticles: async (params = {}) => {
    // params can include: category, sort_by, page, per_page, search
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getArticle: async (articleId) => {
    const response = await api.get(`/articles/${articleId}`);
    return response.data.article;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.categories;
  },
};

// ==================== Voting ====================

export const votingAPI = {
  voteArticle: async (articleId, isBiased) => {
    const response = await api.post(`/articles/${articleId}/vote`, { is_biased: isBiased });
    return response.data;
  },

  deleteVote: async (articleId) => {
    const response = await api.delete(`/articles/${articleId}/vote`);
    return response.data;
  },
};

// ==================== Bookmarks ====================

export const bookmarksAPI = {
  getBookmarks: async (params = {}) => {
    // params can include: page, per_page
    const response = await api.get('/bookmarks', { params });
    return response.data;
  },

  addBookmark: async (articleId) => {
    const response = await api.post(`/articles/${articleId}/bookmark`);
    return response.data;
  },

  removeBookmark: async (articleId) => {
    const response = await api.delete(`/articles/${articleId}/bookmark`);
    return response.data;
  },
};

// ==================== User Activity ====================

export const userAPI = {
  getActivity: async () => {
    const response = await api.get('/user/activity');
    return response.data;
  },
};

// ==================== Statistics ====================

export const statsAPI = {
  getOverview: async () => {
    const response = await api.get('/stats/overview');
    return response.data;
  },
};

// ==================== Health Check ====================

export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
