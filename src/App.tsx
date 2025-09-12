import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./components/ModalProvider";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "./App.css";
import { ProtectedRoute, PublicRoute } from "./components";
import { Orders } from "./pages/Orders";
import { Products } from "./pages/Products";
import { Stats } from "./components/Stats";
import { Toaster } from "react-hot-toast";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
