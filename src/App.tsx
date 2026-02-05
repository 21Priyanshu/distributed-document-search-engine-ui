import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Documents } from "./pages/Documents";

function App() {
  const token = localStorage.getItem("token");
  console.log("App render, token:", token);
  return (
    <BrowserRouter>
      <Routes>
        {/* Default entry */}
        <Route
          path="/"
          element={<Navigate to={token ? "/documents" : "/login"} replace />}
        />

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/documents" element={<Documents />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
