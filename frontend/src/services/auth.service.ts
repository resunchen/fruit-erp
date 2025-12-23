import { post, get } from '../utils/request';
import type { User, LoginRequest, RegisterRequest, AuthData } from '../types/auth';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthData> => {
    const res = await post<AuthData>('/api/v1/auth/register', data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthData> => {
    const res = await post<AuthData>('/api/v1/auth/login', data);
    return res.data;
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
