import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./components/Profile";
import AdminPage from "./pages/admin/AdminPage";
import MainLayout from "./components/MainLayout"; 
import Donate from "./pages/Donate";
import { ConfettiProvider, useConfetti } from "./context/ConfettiContext";
import Confetti from "react-confetti";
import "./App.css";

// Optional: separate component to handle global confetti rendering
function ConfettiWrapper() {
  const { showConfetti } = useConfetti();
  return showConfetti ? <Confetti recycle={false} numberOfPieces={300} /> : null;
}

const App = () => {
  return (
    <AuthProvider>
      <ConfettiProvider>
        <ConfettiWrapper /> {/* Global confetti */}
        <BrowserRouter>
          <Routes>
            {/* Routes with Topbar */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <Profile />
                </MainLayout>
              }
            />
            <Route
              path="/donate"
              element={
                <MainLayout>
                  <Donate />
                </MainLayout>
              }
            />

            {/* Admin route without Topbar */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ConfettiProvider>
    </AuthProvider>
  );
};

export default App;
