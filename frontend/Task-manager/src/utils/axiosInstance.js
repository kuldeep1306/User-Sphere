import axios from 'axios';

// Dynamically set base URL depending on environment
const BASE_URL = 'https://localhost:8000'; // Or your deployed backend URL


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Needed if using cookies for auth
});

// Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error response:', error.response);

      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 500) {
        alert('An internal server error occurred. Please try again later.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    } else if (error.code === 'ECONNABORTED') {
      alert('Request timed out. Please check your connection.');
    } else {
      console.error('Network error:', error.message);
      alert('Network error. Please check your internet and try again.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
