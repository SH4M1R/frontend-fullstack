import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  PowerIcon
} from '@heroicons/react/24/outline';

function Collapsible({ open, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open) {
      const scrollH = el.scrollHeight;
      el.style.maxHeight = `${scrollH}px`;
    } else {
      el.style.maxHeight = `0px`;
    }
  }, [open]);

  return (
    <div
      ref={ref}
      className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      aria-hidden={!open}
    >
      <div className="opacity-100 transition-opacity duration-200 ease-in-out">
        {children}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const nombre = localStorage.getItem("nombreUsuario") || "Invitado";
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openReportes, setOpenReportes] = useState(false);

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white shadow-xl flex flex-col justify-between">
      {/* Título */}
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-center text-indigo-300 tracking-wide">
          ModaStyle
        </h2>
        <p className="text-sm text-center text-indigo-500">YOURBRAND</p>
      </div>

      {/* Usuario */}
      <div className="px-4 py-3 bg-gray-900 border-b border-gray-700 text-center">
        <p className="text-sm font-medium flex justify-center items-center gap-1">
          <UserIcon className="h-4 w-4 text-indigo-300" />
          {nombre}
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-2">
        <p className="text-indigo-400 uppercase text-xs font-semibold">
          General
        </p>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-600 rounded-md transition-colors"
        >
          <ChartBarIcon className="h-5 w-5 text-indigo-300" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/caja"
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-600 rounded-md transition-colors"
        >
          <CurrencyDollarIcon className="h-5 w-5 text-indigo-300" />
          <span>Caja</span>
        </Link>

        <Link
          to="/ventas"
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-600 rounded-md transition-colors"
        >
          <ShoppingCartIcon className="h-5 w-5 text-indigo-300" />
          <span>Venta</span>
        </Link>

        <Link
          to="/compras"
          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-600 rounded-md transition-colors"
        >
          <ShoppingBagIcon className="h-5 w-5 text-indigo-300" />
          <span>Compra</span>
        </Link>

        {/* Administración */}
        <div>
          <button
            onClick={() => setOpenAdmin(!openAdmin)}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-indigo-700/40 transition-colors flex justify-between items-center"
            aria-expanded={openAdmin}
          >
            <div className="flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5 text-indigo-300" />
              <span>Administración</span>
            </div>
            <span className="text-sm">{openAdmin ? "▲" : "▼"}</span>
          </button>

          <Collapsible open={openAdmin}>
            <div className="ml-4 mt-1 space-y-1 py-2">
              <Link
                to="/gestionUsuarios"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-700/40 transition-colors"
              >
                <UserIcon className="h-5 w-5 text-indigo-300" />
                <span>Gestión de Usuarios</span>
              </Link>
              <Link
                to="/productos"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-700/40 transition-colors"
              >
                <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-300" />
                <span>Gestión de Productos</span>
              </Link>
              <Link
                to="/gestionProveedores"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-700/40 transition-colors"
              >
                <TruckIcon className="h-5 w-5 text-indigo-300" />
                <span>Gestión de Proveedores</span>
              </Link>
            </div>
          </Collapsible>
        </div>

        {/* Reportes */}
        <div>
          <button
            onClick={() => setOpenReportes(!openReportes)}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-indigo-700/40 transition-colors flex justify-between items-center"
            aria-expanded={openReportes}
          >
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-300" />
              <span>Reportes</span>
            </div>
            <span className="text-sm">{openReportes ? "▲" : "▼"}</span>
          </button>

          <Collapsible open={openReportes}>
            <div className="ml-4 mt-1 space-y-1 py-2">
              <Link
                to="/reporte-ventas"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-700/40 transition-colors"
              >
                <ShoppingCartIcon className="h-5 w-5 text-indigo-300" />
                <span>Reporte de Ventas</span>
              </Link>
              <Link
                to="/reportes/compras"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-700/40 transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 text-indigo-300" />
                <span>Reporte de Compras</span>
              </Link>
              <Link
                to="/reportes/caja"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-700/40 transition-colors"
              >
                <CurrencyDollarIcon className="h-5 w-5 text-indigo-300" />
                <span>Reporte de Caja</span>
              </Link>
            </div>
          </Collapsible>
        </div>

        {/* Configuración */}
        <Link
          to="/configuracion"
          className="flex items-center gap-2 px-4 py-2 mt-4 rounded-md hover:bg-indigo-700/40 transition-colors"
        >
          <Cog6ToothIcon className="h-5 w-5 text-indigo-300" />
          <span>Configuración</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded-md hover:bg-red-500 transition-colors"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("nombreUsuario");
          }}
        >
          <PowerIcon className="h-5 w-5 text-white" />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
}