import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('DEBUG: Resolved API_URL is', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Auth Token and Tenant ID
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulsebid_token');
    const tenantId = localStorage.getItem('pulsebid_tenant_id') || 'tenant-alpha';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalized Error Handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalizedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.details || null,
      isNetworkError: !error.response,
    };

    if (error.response?.status === 401) {
      // Broadcast logout event if unauthenticated
      window.dispatchEvent(new CustomEvent('pulsebid:unauthorized'));
    }

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
