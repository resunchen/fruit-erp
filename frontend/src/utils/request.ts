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

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...fetchOptions,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    // Handle non-JSON responses (network errors, HTML error pages, etc.)
    const contentType = response.headers.get('content-type');
    let result: any;

    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      // If response is not JSON, create a proper error response
      if (!response.ok) {
        throw new Error(
          `Server error (${response.status}): ${text.substring(0, 100) || 'No response body'}`
        );
      }
      // For non-JSON but successful responses, return a default structure
      result = { code: response.status, data: null, message: 'Success' };
    }

    if (!response.ok) {
      const errorMessage = result.message || `API request failed (${response.status})`;
      // Only redirect to login for token expiration (existing token in localStorage)
      if (response.status === 401 && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new Error(errorMessage);
    }

    return result;
  } catch (err) {
    // Handle network errors, parsing errors, etc.
    const errorMessage = err instanceof Error ? err.message : 'Network request failed';
    throw new Error(errorMessage);
  }
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
