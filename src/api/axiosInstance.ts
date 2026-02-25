import axios from "axios";

// ------------------------------
// AXIOS INSTANCE
// ------------------------------
const api = axios.create({
  baseURL: "http://localhost:4000",
});

// ------------------------------
// REQUEST INTERCEPTOR
// ------------------------------
api.interceptors.request.use(
  (config) => {
    const data = localStorage.getItem("mentortrack_auth");

    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error("Token parse error:", err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------
// RESPONSE INTERCEPTOR (🔥 FIX)
// ------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // ❌ SADECE TOKEN GERÇEKTEN GEÇERSİZSE
    if (status === 401) {
      console.warn("Unauthorized → Token geçersiz");

      localStorage.removeItem("mentortrack_auth");
      window.location.href = "/login";
    }

    // ⛔ 403 = Yetki yok → ASLA logout yapma
    if (status === 403) {
      console.warn("Forbidden → Yetki yok (logout yapılmadı)");
    }

    return Promise.reject(error);
  }
);

export default api;
