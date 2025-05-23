/**
 * ProtectedRoute
 * 
 * This ensures that the Dashboard component can only be accessed after a user
 * has sucessfully logged in. Therefore, if someone tries to use the '/dashboard'
 * URL before logging in, they will be redirected to the login page.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}