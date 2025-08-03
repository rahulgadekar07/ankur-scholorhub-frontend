import { createContext, useState, useContext } from "react";
import { loginUser, signUpUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null); // Clear previous error
    try {
      const { user, token } = await loginUser(credentials);
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return true;
    } catch (err) {
      setError(err.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials) => {
    setLoading(true);
    setError(null); // Clear previous error
    try {
      const { user, token } = await signUpUser(credentials);
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
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
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);