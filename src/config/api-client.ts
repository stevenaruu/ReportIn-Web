import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:7000",
  timeout: 15000, // 15 seconds timeout
  headers: { "Content-Type": "application/json" },
});

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
