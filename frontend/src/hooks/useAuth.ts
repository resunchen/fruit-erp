import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export const useAuth = () => {
  const { user, token, isLoading, error, setUser, setToken, setLoading, setError, logout } = useAuthStore();

  // Stable logout callback
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Load user info when token exists but user is not loaded
  useEffect(() => {
    if (token && !user) {
      authService.getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch((err) => {
          console.error('Failed to load user:', err);
          // If token is invalid, logout
          handleLogout();
        });
    }
  }, [token, user, setUser, handleLogout]);

  const login = useCallback(async (data: LoginRequest) => {
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
  }, [setUser, setToken, setLoading, setError]);

  const register = useCallback(async (data: RegisterRequest) => {
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
  }, [setUser, setToken, setLoading, setError]);

  const logoutAsync = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      handleLogout();
    }
  }, [handleLogout]);

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout: logoutAsync,
    isAuthenticated: !!token && !!user,
  };
};
