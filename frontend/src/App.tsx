import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { authService } from './services/auth.service';

import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import NotFoundPage from './pages/NotFound';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.token !== null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { setUser, token } = useAuthStore();

  // Load user on mount if token exists
  useEffect(() => {
    if (token) {
      authService.getMe()
        .then((user) => setUser(user))
        .catch(() => {
          // Token is invalid, user will be logged out
        });
    }
  }, [token, setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
