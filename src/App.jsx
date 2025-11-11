import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Proveedores from "./pages/GestionProveedores";
import Empleados from "./pages/Empleados";
import Compras from "./pages/Compras";
import CompraForm from "./pages/CompraForm";
import PrivateRoute from "./components/PrivateRoute";
import Configuracion from "./pages/Configuracion";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  console.log("📍 Current route:", location.pathname);
  console.log("🔐 Is login page:", isLoginPage);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      {!isLoginPage && (
        <div className="fixed top-0 left-0 h-full z-50">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isLoginPage ? "ml-0" : "ml-80"
        }`}
      >
        <div className="w-full h-full">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/empleados" element={<Empleados />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/compras" element={<Compras />} />
              <Route path="/compras/crear" element={<CompraForm />} />
              <Route path="/compras/editar/:id" element={<CompraForm />} />
              <Route path="/configuracion" element={<Configuracion />} />
            </Route>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - Redirección para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;