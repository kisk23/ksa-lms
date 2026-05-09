import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    throw new Error(error.response?.data?.message ?? error.message ?? 'Request failed');
  },
);

class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    const response = await axiosClient.get(endpoint);
    return response.data?.data ?? response.data;
  }

  async post<T>(endpoint: string, data?: unknown, idempotencyKey?: string): Promise<T> {
    const response = await axiosClient.post(endpoint, data, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    });
    return response.data?.data ?? response.data;
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await axiosClient.patch(endpoint, data);
    return response.data?.data ?? response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await axiosClient.delete(endpoint);
    return response.data?.data ?? response.data;
  }
}

export const apiClient = new ApiClient();
