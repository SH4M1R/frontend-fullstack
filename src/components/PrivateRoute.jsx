import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { usuario, loading } = useAuth();

    if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Cargando sesión...</p>
      </div>
    );
  }

  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}