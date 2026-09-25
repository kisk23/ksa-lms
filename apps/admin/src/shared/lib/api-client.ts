const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

type ApiErrorPayload = {
  message?: string | string[];
  errors?: Record<string, string[]>;
  cause?: string;
};

export const ADMIN_SESSION_EXPIRED_EVENT = 'admin-session-expired';

function messageFromApiPayload(data: ApiErrorPayload | undefined): string | undefined {
  if (!data) return undefined;

  const { message, errors } = data;
  if (typeof message === 'string' && message.trim()) return message.trim();
  if (Array.isArray(message) && message.length > 0) {
    const parts = message.filter((m): m is string => typeof m === 'string' && m.trim().length > 0);
    if (parts.length > 0) return parts.join(' | ');
  }
  if (errors && typeof errors === 'object') {
    const first = Object.values(errors)
      .flat()
      .find((m): m is string => typeof m === 'string');
    if (first?.trim()) return first.trim();
  }

  return undefined;
}

function notifySessionExpired(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
  }
}

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    // Keep refresh single-flight so parallel 401s do not rotate the same refresh token twice.
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('SESSION_EXPIRED');
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
}

async function readError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => undefined)) as ApiErrorPayload | undefined;
  const baseMessage = messageFromApiPayload(payload) ?? `HTTP ${response.status}`;
  if (payload?.cause) {
    return `${baseMessage} | Cause: ${payload.cause}`;
  }
  return baseMessage;
}

function shouldAttemptRefresh(endpoint: string): boolean {
  return !['/auth/login', '/auth/register', '/auth/refresh'].some((path) =>
    endpoint.includes(path),
  );
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    canRetry = true,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (response.status === 401 && canRetry && shouldAttemptRefresh(endpoint)) {
      try {
        await refreshAccessToken();
        return this.request<T>(endpoint, options, false);
      } catch {
        notifySessionExpired();
        throw new Error('SESSION_EXPIRED');
      }
    }

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    const json = await response.json().catch(() => undefined);
    return json?.data ?? json;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
