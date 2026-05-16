import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/** Same-origin proxy via next.config rewrites — cookies are sent automatically */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

/** Body shape from AllExceptionsFilter / Nest ValidationPipe */
type ApiErrorPayload = {
  message?: string | string[];
  errors?: Record<string, string[]>;
};

function messageFromApiPayload(data: ApiErrorPayload | undefined): string | undefined {
  if (!data) return undefined;

  const { message, errors } = data;
  if (typeof message === 'string' && message.trim()) return message.trim();
  if (Array.isArray(message) && message.length > 0) {
    const parts = message.filter((m): m is string => typeof m === 'string' && m.trim().length > 0);
    if (parts.length > 0) return parts.join(' • ');
  }
  if (errors && typeof errors === 'object') {
    const first = Object.values(errors)
      .flat()
      .find((m): m is string => typeof m === 'string');
    if (first?.trim()) return first.trim();
  }
  return undefined;
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = axiosClient
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  await refreshPromise;
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes('/auth/login') &&
      !original.url?.includes('/auth/register') &&
      !original.url?.includes('/auth/refresh')
    ) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return axiosClient(original);
      } catch {
        // fall through to normalized error
      }
    }

    const fromBody = messageFromApiPayload(error.response?.data);
    const text = fromBody ?? error.message ?? 'Request failed';
    throw new Error(text);
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
