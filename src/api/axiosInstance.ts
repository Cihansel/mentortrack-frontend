import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.error("❌ VITE_API_URL is missing. Check Vercel env vars.");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
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
          config.headers = config.headers ?? {};
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
// RESPONSE INTERCEPTOR
// ------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = (error.config?.url as string) || "";

    // ✅ Login endpointleri 401 dönebilir → redirect yapma
    const isLoginRequest =
      url.includes("/auth/login") ||
      url.includes("/student/login") ||
      url.includes("/parent/login");

    if (status === 401 && !isLoginRequest) {
      console.warn("Unauthorized → Token geçersiz (logout)");
      localStorage.removeItem("mentortrack_auth");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("Forbidden → Yetki yok (logout yapılmadı)");
    }

    return Promise.reject(error);
  }
);

export default api;