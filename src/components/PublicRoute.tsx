import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to="/orders" replace /> : <>{children}</>;
}