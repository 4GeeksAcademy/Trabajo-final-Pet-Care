import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, onlyAnon = false, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (onlyAnon) {
    if (token && user) {
      if (user.is_admin) return <Navigate to="/admin-panel" replace />;
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  if (adminOnly) {
    if (!token || !user || !user.is_admin) return <Navigate to="/login" replace />;
    return children;
  }

  if (!token || !user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
