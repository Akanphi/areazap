import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://82.112.240.168.nip.io/area_api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    // Skip token for auth endpoints
    if (
      config.url?.includes('auth/login') ||
      config.url?.includes('auth/register') ||
      config.url?.includes('auth/reset-password')
    ) {
      console.log("Skipping token for auth endpoint:", config.url);
      return config;
    }

    const token = localStorage.getItem('access');
    if (token) {
      console.log("Adding token to request:", config.url, token.substring(0, 10) + "...");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le refresh token automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà tenté de refresh
    // Ignorer les erreurs 401 sur le login et le register pour éviter les boucles
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('auth/login') &&
      !originalRequest.url?.includes('auth/register') &&
      !originalRequest.url?.includes('token-action')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        const response = await axios.post(`${API_URL}auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh: newRefresh } = response.data;
        localStorage.setItem('access', access);
        if (newRefresh) {
          localStorage.setItem('refresh', newRefresh);
        }

        // Retry la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh a échoué, déconnecter l'utilisateur
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;