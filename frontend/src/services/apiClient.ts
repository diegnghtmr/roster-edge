import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
const ENV = import.meta.env.VITE_ENV || 'development';

// Log configuration in development
if (ENV === 'development' && import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true') {
  console.log('API Configuration:', {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    environment: ENV
  });
}

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Here you can add authentication tokens if needed
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

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      error.message = 'Request timeout. Please try again.';
    } else if (error.code === 'ERR_NETWORK') {
      // Network error
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Redirect to login if token expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'No response from server. Please check your connection.';
    }
    
    // Log errors in development
    if (ENV === 'development') {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Generic methods for HTTP requests
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get<T>(url, config),
  
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post<T>(url, data, config),
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put<T>(url, data, config),
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch<T>(url, data, config),
  
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete<T>(url, config),
};

export default apiClient;
