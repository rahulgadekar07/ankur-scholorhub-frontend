import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import './App.css';
import Profile from "./components/Profile";
import Topbar from "./components/Topbar";
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Topbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "invigilator"]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
