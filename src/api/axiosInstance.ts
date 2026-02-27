import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // Vercel build loglarında + browser console’da görünür
  console.error("❌ VITE_API_URL is missing. Check Vercel env vars.");
  // İstersen burada throw da atabilirsin:
  // throw new Error("VITE_API_URL is missing");
}

const api = axios.create({
  baseURL, // ❗ fallback yok
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

    if (status === 401) {
      console.warn("Unauthorized → Token geçersiz");
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