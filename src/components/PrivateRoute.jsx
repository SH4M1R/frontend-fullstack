import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { usuario } = useAuth();
  
  console.log("🛡️ PrivateRoute - Usuario:", usuario);
  console.log("🛡️ PrivateRoute - Ruta actual:", window.location.pathname);

  if (!usuario) {
    console.log("🚫 Acceso denegado - Redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Acceso permitido - Renderizando contenido protegido");
  return <Outlet />;
};

export default PrivateRoute;