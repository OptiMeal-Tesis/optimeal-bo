import { useAuth } from "../contexts/AuthContext";
import { CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="relative">
                <div className="blur-sm pointer-events-none">
                    {children}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <CircularProgress
                        sx={{
                            color: 'var(--color-primary-500)'
                        }}
                    />
                </div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}