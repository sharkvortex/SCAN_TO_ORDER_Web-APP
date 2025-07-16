import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SoundNotifyProvider } from "./contexts/SoundContext/SoundNotifyProvider";
import Home from "./pages/Home";
import BasketDetail from "./pages/BasketDetail";
import Admin from "./pages/admin/Admin";
import AdminUser from "./pages/admin/AdminUser";

// Auth
import LoginForm from "./components/Auth/LoginForm";
// Middleware
import VerifyToken from "./middleware/VerifyToken";
import ProtectRoute from "./middleware/ProtectRoute";
import ProtectRouteAuth from "./middleware/ProtectRouteAuth";
function App() {
  return (
    <Router>
      <SoundNotifyProvider>
        <Routes>
          <Route
            path="/"
            element={
              <VerifyToken>
                <Home />
              </VerifyToken>
            }
          />
          <Route
            path="/basket"
            element={
              <VerifyToken>
                <BasketDetail />
              </VerifyToken>
            }
          />

          <Route
            path="/auth/login"
            element={
              <ProtectRouteAuth>
                <LoginForm />
              </ProtectRouteAuth>
            }
          />

          <Route
            path="/admin/pos"
            element={
              <ProtectRoute AllowRole={["ADMINISTRATOR", "ADMIN", "EMPLOYEE"]}>
                <Admin />
              </ProtectRoute>
            }
          />
          <Route
            path="/system/dashboard/users"
            element={
              <ProtectRoute AllowRole={["ADMINISTRATOR", "ADMIN"]}>
                <AdminUser />
              </ProtectRoute>
            }
          />
        </Routes>
      </SoundNotifyProvider>
    </Router>
  );
}

export default App;
