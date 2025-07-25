import { BASE_URL } from "@/constant/ApiService";
import store from "@/store";
import axios from "axios";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 0,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const username = state.auth.username ?? "unknown";

    if (username) {
      config.headers["username"] = username;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return Promise.reject(new Error("Request timed out. Please try again."));
      }
      return Promise.reject(error.response?.data || "An error occurred.");
    }
    return Promise.reject("Unexpected error occurred.");
  }
);

export default apiClient;