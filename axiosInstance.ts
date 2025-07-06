import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 40000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

let accessToken: string | null = localStorage.getItem('accessToken');

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error as AxiosError);
    }
  });
  failedQueue = [];
};

// ➤ Attach access token to all requests
axiosInstance.interceptors.request.use(
  config => {
    const token = accessToken ?? localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ➤ Handle access token expiration and refresh
axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    const isTokenExpired =
      error.response?.status === 401 &&
      (error.response.data?.errorCode === 'TOKEN_EXPIRED' ||
        error.response.data?.message === 'Access token expired');

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        accessToken = newAccessToken;
        localStorage.setItem('accessToken', newAccessToken);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);

        if (
          refreshError.response?.status === 403 ||
          ['Invalid refresh token', 'Session not found or expired'].includes(
            refreshError.response?.data?.message
          )
        ) {
          //  handle automatic logout

          accessToken = null;
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
