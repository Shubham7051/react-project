import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from "../api/auth"; // adjust path if needed



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh') || null);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);
    } else {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
  }, [accessToken, refreshToken]);

const login = async (email, password) => {
  try {
    console.log("Sending login request with:", { email, password });
    const res = await loginUser({ email, password });
    console.log("Login response:", res.data);

    setAccessToken(res.data.access);
    setRefreshToken(res.data.refresh);
    setUser(res.data.user);

    return res.data; // so Login.jsx can use it
  } catch (err) {
    if (err.response) {
      console.error("Login error response:", err.response.data);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Login error:", err.message);
    }
    throw err;
  }
};

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
