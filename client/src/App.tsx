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

          <Route path="/auth/login" element={<LoginForm />} />

          <Route path="/admin/pos" element={<Admin />} />
          <Route path="/system/dashboard/users" element={<AdminUser />} />
        </Routes>
      </SoundNotifyProvider>
    </Router>
  );
}

export default App;
