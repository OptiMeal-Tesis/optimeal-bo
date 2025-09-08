import { Routes, Route } from 'react-router-dom'
import { AuthProvider} from './contexts/AuthContext'
import Login from './pages/Login'
import './App.css'
import { PublicRoute } from './components/PublicRoute'

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
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
