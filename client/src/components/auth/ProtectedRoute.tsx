import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../../classes/AuthService';

const authService = AuthService.getInstance();

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !authService.isAdmin()) {
    return <Navigate to="/catalogue" replace />;
  }

  return <>{children}</>;
}
