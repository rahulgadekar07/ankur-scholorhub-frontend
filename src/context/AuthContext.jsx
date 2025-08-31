import { createContext, useState, useContext } from "react";
import { loginUser, signUpUser } from "../services/authService";

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

      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now

      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiryTime.toString()); // <-- fix

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
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now

      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiryTime.toString()); // <-- fix

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

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
