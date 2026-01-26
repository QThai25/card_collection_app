// src/auth/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { getItem, setItem, removeItem } from "../utils/storage";
import api from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load stored token + user on startup
    async function loadUser() {
      try {
        const storedToken = await getItem("token");
        const storedUser = await getItem("user");
        if (storedToken) {
          setToken(storedToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } 
          catch { setUser(storedUser); }
        }
      } catch (e) {
        console.error("loadUser error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadUser();

    // response interceptor auto logout on 401
    const id = api.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err?.response?.status === 401) {
          console.warn("API 401 -> auto logout");
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  const login = async (newToken, userData) => {
    try {
      await setItem("token", newToken);
      await setItem("user", JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (e) {
      console.error("login error:", e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await removeItem("token");
      await removeItem("user");
    } catch (e) {
      console.warn("logout clear storage failed:", e);
    } finally {
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};



