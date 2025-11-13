import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUsuario(parsed);
      } catch (err) {
        console.error("Error al parsear usuario guardado:", err);
        localStorage.removeItem("usuario");
      }
    }
    setLoading(false);
  }, []);

  const login = (empleado) => {
    setUsuario(empleado);
    localStorage.setItem("usuario", JSON.stringify(empleado));
    localStorage.setItem("token", empleado.token); 
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  // 🔹 fetch con token automático
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No autenticado");

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error("Sesión expirada o no autorizada");
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
