// app/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Runs BEFORE every API request
 */
api.interceptors.request.use(
  (config) => {
    // 1️⃣ Read token from localStorage
    const token = localStorage.getItem("token");

    // 2️⃣ If token exists, attach it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Runs when backend responds with error
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 3️⃣ Handle expired / invalid token
    if (status === 401) {
      localStorage.removeItem("token");

      // redirect user to login page
      window.location.href = "/login";
    }

    const message = error?.response?.data?.error || "Something went wrong";
    return Promise.reject({ message, status });
  }
);

export default api;
