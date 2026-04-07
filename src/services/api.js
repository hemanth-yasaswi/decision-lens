import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await api.post("/auth/refresh", { refresh_token: refreshToken });
          const { access_token, refresh_token: newRefreshToken } = response.data;
          localStorage.setItem("token", access_token);
          localStorage.setItem("refresh_token", newRefreshToken);
          try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const userObj = JSON.parse(userStr);
              userObj.token = access_token;
              localStorage.setItem("user", JSON.stringify(userObj));
            }
          } catch (_) {}
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => {
  const formData = new FormData();
  formData.append("username", data.email);
  formData.append("password", data.password);
  return api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

// Documents
export const getDocuments = () => api.get("/documents/");
export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Chat
export const chat = (query, documentIds = null) =>
  api.post("/chat/", {
    query,
    document_ids: documentIds,
  });

export const getData = async () => {
  try {
    const response = await getDocuments();
    const uploadedFiles = response.data;

    const dashboardData = {
      totalDocuments: uploadedFiles.length.toString(),
      docChange: "+0%",
      docTrend: "up",
      activeUsers: uploadedFiles.length > 0 ? "1" : "0",
      userChange: "+0%",
      userTrend: "up",
      accuracy: uploadedFiles.length > 0 ? "99.9%" : "0%",
      accuracyChange: "+0%",
      accuracyTrend: "up",
      responseTime: uploadedFiles.length > 0 ? "0.8s" : "0s",
      timeChange: "0s",
      timeTrend: "down",
      recentDocuments: uploadedFiles
        .map((f) => ({
          name: f.filename,
          date: new Date(f.upload_date).toLocaleDateString(),
          status: f.status === "ready" ? "Processed" : f.status === "error" ? "Error" : "Processing",
        }))
        .reverse()
        .slice(0, 5),
      recentActivity: uploadedFiles
        .map((f, i) => ({
          id: i,
          user: "You",
          type: "upload",
          title: f.filename,
          time: new Date(f.upload_date).toLocaleTimeString(),
        }))
        .reverse()
        .slice(0, 5),
    };

    return { data: dashboardData };
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    return {
      data: {
        totalDocuments: "0",
        docChange: "+0%",
        docTrend: "up",
        activeUsers: "0",
        userChange: "+0%",
        userTrend: "up",
        accuracy: "0%",
        accuracyChange: "+0%",
        accuracyTrend: "up",
        responseTime: "0s",
        timeChange: "0s",
        timeTrend: "down",
        recentDocuments: [],
        recentActivity: [],
      },
    };
  }
};

export default api;
