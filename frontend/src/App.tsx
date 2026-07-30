import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PacientesPage from "./pages/patient/PatientPage";
import LoginPage from "./pages/auth/LoginPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/pacientes" element={<PacientesPage />} />
          </Route>

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/pacientes" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
