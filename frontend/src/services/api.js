import axios from "axios";

// Use environment variable for API URL (set VITE_API_URL in .env for production)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5028/api",
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
