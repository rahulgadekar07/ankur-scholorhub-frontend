// AuthContext.jsx

import { createContext, useState, useContext } from "react";
import { loginUser, signUpUser } from "../services/authService";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const expiresAt = localStorage.getItem("expiresAt");

    if (!storedUser || !expiresAt) return null;
    if (Date.now() > parseInt(expiresAt, 10)) {
      localStorage.clear();
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");

    if (!storedToken || !expiresAt) return null;
    if (Date.now() > parseInt(expiresAt, 10)) {
      localStorage.clear();
      return null;
    }
    return storedToken;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await loginUser(credentials);
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour

      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiryTime.toString());

      return { success: true, user, token };
    } catch (err) {
      setError(err.message || "Login failed");
      throw err; // ✅ Important — propagate to handleSignInSubmit
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await signUpUser(credentials);
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour

      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiryTime.toString());

      return true;
    } catch (err) {
      setError(err.message || "Sign-up failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    console.log("User logged out");
  };

  // 🔹 NEW: fetch latest user from backend
  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        // use toast
        toast.error(
          err.response.data.message || "Your account is deactivated."
        );
        logout(); // optional: log them out automatically
      } else {
        console.error("Failed to fetch user:", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        login,
        signup,
        logout,
        fetchUser, // expose
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
