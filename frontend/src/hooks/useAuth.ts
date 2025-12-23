import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export const useAuth = () => {
  const { user, token, isLoading, error, setUser, setToken, setLoading, setError, logout } = useAuthStore();

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setUser(response.user);
      setToken(response.token);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.token);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout: handleLogout,
    isAuthenticated: !!token && !!user,
  };
};
