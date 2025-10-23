import axios from "axios";


export const apiClient = axios.create({
  baseURL: "http://182.48.80.49:8080/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    config.headers = {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return config;
  },
  (error) => Promise.reject(error)
);