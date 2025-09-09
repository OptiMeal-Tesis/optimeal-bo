import { useAuth } from "../contexts/AuthContext";
import { CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="relative">
          <div className="blur-sm pointer-events-none">{children}</div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <CircularProgress
              sx={{
                color: "var(--color-primary-500)",
              }}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};
