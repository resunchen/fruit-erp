import type { ApiResponse } from '../types/common';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  data?: Record<string, any>;
}

export async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { data, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add token to headers if exists
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...fetchOptions,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(result.message || 'API request failed');
  }

  return result;
}

export async function get<T>(url: string) {
  return request<T>(url, { method: 'GET' });
}

export async function post<T>(url: string, data?: any) {
  return request<T>(url, { method: 'POST', data });
}

export async function put<T>(url: string, data?: any) {
  return request<T>(url, { method: 'PUT', data });
}

export async function del<T>(url: string) {
  return request<T>(url, { method: 'DELETE' });
}
