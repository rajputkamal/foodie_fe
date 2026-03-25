import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://lift-be-890845531583.asia-south1.run.app/api/foodie",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
