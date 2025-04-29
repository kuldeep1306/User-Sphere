import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 180000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("Error response:", error.response); // Logs the full error response
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error:", error.response?.data || error.message);
                alert("An error occurred on the server. Please try again later.");
            } else {
                console.error(`Unexpected error: ${error.response.status}`, error.response.data);
                alert("An unexpected error occurred. Please try again.");
            }
        } else if (error.code === "ECONNABORTED") {
            alert("Request timed out. Please check your internet connection or try again later.");
        } else {
            console.error("Network error:", error.message);
            alert("Network error. Please check your connection and try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
