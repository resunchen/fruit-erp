import { post, get } from '../utils/request';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return post<AuthResponse>('/api/v1/auth/register', data).then(res => res.data);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return post<AuthResponse>('/api/v1/auth/login', data).then(res => res.data);
  },

  logout: async (): Promise<void> => {
    await post('/api/v1/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await get<{ user: User }>('/api/v1/users/me');
    return res.data.user;
  },

  refreshToken: async (refreshToken: string): Promise<string> => {
    const res = await post<{ token: string }>('/api/v1/auth/refresh', { refreshToken });
    return res.data.token;
  },
};
