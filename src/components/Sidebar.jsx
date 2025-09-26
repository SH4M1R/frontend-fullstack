import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const nombre = localStorage.getItem("nombreUsuario") || "Invitado";

  const [openAdmin, setOpenAdmin] = useState(false);
  const [openReportes, setOpenReportes] = useState(false);

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-gray-900 text-white flex flex-col justify-between shadow-lg">
      {/* Título */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center">ModaStyle - YOURBRAND</h2>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto">
        {nombre && (
          <div className="p-4 bg-gray-800 text-center rounded-md mx-2 my-4">
            <p className="font-medium">👤 {nombre}</p>
          </div>
        )}

        <nav className="px-2">
          <p className="text-gray-400 uppercase text-xs px-2 mt-4 mb-2">General</p>
          <Link to="/dashboard" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 📊 Dashboard </Link>
          <Link to="/caja" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 💰 Caja </Link>
          <Link to="/ventas" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 🛒 Realizar Venta </Link>
          <Link to="/compras" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 🛍️ Realizar Compra </Link>

          {/* Administración desplegable */}
          <p
            onClick={() => setOpenAdmin(!openAdmin)}
            className="cursor-pointer flex justify-between items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors mt-6"
          >
            <span>👥 Administración</span>
            <span>{openAdmin ? "▲" : "▼"}</span>
          </p>
          {openAdmin && (
            <div className="ml-4">
              <Link to="/gestionUsuarios" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 👤 Gestión de Usuarios </Link>
              <Link to="/productos" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 📋 Gestión de Productos </Link>
              <Link to="/proveedores" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 🚚 Gestión de Proveedores </Link>
            </div>
          )}

          {/* Reportes desplegable */}
          <p
            onClick={() => setOpenReportes(!openReportes)}
            className="cursor-pointer flex justify-between items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors mt-6"
          >
            <span>📈 Reportes</span>
            <span>{openReportes ? "▲" : "▼"}</span>
          </p>
          {openReportes && (
            <div className="ml-4">
              <Link to="/reporte-ventas" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 🛒 Reporte de Ventas</Link>
              <Link to="/reportes/compras" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 🛍️ Reporte de Compras </Link>
              <Link to="/reportes/caja" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"> 💰 Reporte de Caja </Link>
            </div>
          )}

          {/* Configuración */}
          <Link to="/configuracion" className="block px-4 py-2 mt-6 rounded-md hover:bg-gray-700 transition-colors"
          > ⚙️ Configuración </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Link to="/login" className="block text-center px-4 py-2 bg-red-600 rounded-md hover:bg-red-500 transition-colors"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("nombreUsuario");
          }}>⏻ Cerrar Sesión</Link>
      </div>
    </aside>
  );
}