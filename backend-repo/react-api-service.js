// api.js - React API Service for NETRA News Platform

import axios from 'axios';

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('netra_user');
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
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
      localStorage.setItem('netra_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('netra_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('netra_user');
    window.location.href = '/auth';
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    if (response.data.user) {
      localStorage.setItem('netra_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('netra_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== Articles ====================

export const articlesAPI = {
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getArticle: async (articleId) => {
    const response = await api.get(`/articles/${articleId}`);
    if (response.data.article) {
      return response.data.article;
    } else if (response.data.id) {
      return response.data;
    } else {
      throw new Error('Unexpected response format from API');
    }
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

// ==================== Comments ====================

export const commentsAPI = {
  getComments: async (articleId) => {
    const response = await api.get(`/articles/${articleId}/comments`);
    return response.data.comments;
  },
  
  addComment: async (articleId, content) => {
    const response = await api.post(`/articles/${articleId}/comments`, { content });
    return response.data;
  }
};

// ==================== Bookmarks ====================

export const bookmarksAPI = {
  getBookmarks: async (params = {}) => {
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
  // Main overview stats
  getOverview: async () => {
    const response = await api.get('/stats/overview');
    return response.data;
  },

  // Voting patterns stats
  getVotingStats: async () => {
    const response = await api.get('/stats/voting');
    return response.data;
  },

  // Bookmark patterns stats
  getBookmarkStats: async () => {
    const response = await api.get('/stats/bookmarks');
    return response.data;
  },

  // News source/agency stats
  getSourceStats: async () => {
    const response = await api.get('/stats/sources');
    return response.data;
  },

  // Category stats
  getCategoryStats: async () => {
    const response = await api.get('/stats/categories');
    return response.data;
  },

  // Author stats
  getAuthorStats: async () => {
    const response = await api.get('/stats/authors');
    return response.data;
  },

  // Engagement stats
  getEngagementStats: async () => {
    const response = await api.get('/stats/engagement');
    return response.data;
  },

  // Fetch all stats at once (for dashboard)
  getAllStats: async () => {
    const [overview, voting, bookmarks, sources, categories, authors, engagement] = await Promise.all([
      statsAPI.getOverview(),
      statsAPI.getVotingStats(),
      statsAPI.getBookmarkStats(),
      statsAPI.getSourceStats(),
      statsAPI.getCategoryStats(),
      statsAPI.getAuthorStats(),
      statsAPI.getEngagementStats(),
    ]);
    return { overview, voting, bookmarks, sources, categories, authors, engagement };
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