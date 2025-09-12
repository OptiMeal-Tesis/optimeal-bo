import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{children}</>;
  }

  return isAuthenticated ? <Navigate to="/orders" replace /> : <>{children}</>;
};
