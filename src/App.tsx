import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./components/ModalProvider";
import Login from "./pages/Login";
import "./App.css";
import { ProtectedRoute, PublicRoute } from "./components";
import { Orders } from "./pages/Orders";
import { Products } from "./pages/Products";
import { Stats } from "./components/Stats";

function AppRoutes() {
  return (
    <Routes>
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
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <AppRoutes />
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
