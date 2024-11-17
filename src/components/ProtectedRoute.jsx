import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have this

export default function ProtectedRoute({ fallback, children }) {
  const { user } = useAuth();

  if (!user && fallback) {
    return fallback;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
} 