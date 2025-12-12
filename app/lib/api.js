// app/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional interceptors (you may need later for auth)
api.interceptors.request.use(
  (config) => {
    return config; // no token yet
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.error || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
