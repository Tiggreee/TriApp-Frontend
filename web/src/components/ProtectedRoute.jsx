import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, isLoggedIn, redirectPath = '/music' }) {
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}
