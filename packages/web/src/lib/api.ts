const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(status: number, data: Record<string, unknown>) {
    super((data.error as string) || (data.message as string) || 'An error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}

export function get<T>(endpoint: string) {
  return fetchApi<T>(endpoint, { method: 'GET' });
}

export function post<T>(endpoint: string, body?: unknown) {
  return fetchApi<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export function put<T>(endpoint: string, body?: unknown) {
  return fetchApi<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
}

export function patch<T>(endpoint: string, body?: unknown) {
  return fetchApi<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
}

export function del<T>(endpoint: string) {
  return fetchApi<T>(endpoint, { method: 'DELETE' });
}
