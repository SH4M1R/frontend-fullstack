import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  UserIcon,
  PowerIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  BuildingStorefrontIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

function Collapsible({ open, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.maxHeight = open ? `${el.scrollHeight}px` : "0px";
  }, [open]);

  return (
    <div
      ref={ref}
      className="overflow-hidden transition-all duration-500 ease-in-out"
    >
      <div className="transform transition-all duration-500 ease-in-out">
        {children}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const { tema, toggleTema, idioma } = useTheme();
  const location = useLocation();
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openAnalisis, setOpenAnalisis] = useState(false);

  // Traducciones para el sidebar
  const traducciones = {
    es: {
      general: "General",
      dashboard: "Dashboard",
      arqueoCaja: "Arqueo de Caja",
      ventas: "Ventas",
      compras: "Compras",
      administracion: "Administración",
      gestionEmpleados: "Gestión de Empleados",
      gestionProveedores: "Gestión de Proveedores",
      gestionProductos: "Gestión de Productos",
      analisisConfig: "Análisis & Reportes",
      reportes: "Reportes Avanzados",
      configuracion: "Configuración",
      cerrarSesion: "Cerrar Sesión",
      modoOscuro: "Modo Oscuro",
      modoClaro: "Modo Claro"
    },
    en: {
      general: "General",
      dashboard: "Dashboard",
      arqueoCaja: "Cash Count",
      ventas: "Sales",
      compras: "Purchases",
      administracion: "Administration",
      gestionEmpleados: "Employee Management",
      gestionProveedores: "Supplier Management",
      gestionProductos: "Product Management",
      analisisConfig: "Analysis & Reports",
      reportes: "Advanced Reports",
      configuracion: "Settings",
      cerrarSesion: "Logout",
      modoOscuro: "Dark Mode",
      modoClaro: "Light Mode"
    }
  };

  const t = traducciones[idioma];

  const isActiveLink = (path) => location.pathname === path;

  const sidebarClasses = `h-full w-80 shadow-2xl flex flex-col justify-between transition-all duration-500 ease-in-out ${
    tema === "oscuro" 
      ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-r border-slate-700" 
      : "bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 text-white border-r border-slate-600"
  }`;

  const linkBaseClasses = "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden";
  const linkActiveClasses = "bg-white/10 shadow-lg scale-105 border-l-4 border-cyan-400";
  const linkInactiveClasses = "hover:bg-white/5 hover:scale-102 border-l-4 border-transparent";

  const sectionTitleClasses = `uppercase text-sm font-bold tracking-widest mb-4 pl-6 ${
    tema === "oscuro" ? "text-cyan-300" : "text-cyan-200"
  }`;

  const subLinkClasses = "flex items-center gap-3 px-8 py-3 rounded-lg text-sm transition-all duration-300 group hover:bg-white/5 ml-2 border-l-2 border-transparent hover:border-cyan-400";

  return (
    <aside className={sidebarClasses}>
      {/* Logo y Header */}
      <div className={`p-8 border-b ${tema === "oscuro" ? "border-slate-700" : "border-slate-600"} flex flex-col items-center bg-gradient-to-r from-cyan-600/20 to-blue-600/20`}>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <BuildingStorefrontIcon className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -inset-1 bg-cyan-500/30 rounded-2xl blur-sm animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-center leading-tight">
          SportStyle<br/>Business Pro
        </h2>
        <p className="text-cyan-200 text-sm mt-2 text-center">Gestión Integral de Moda Deportiva</p>
        
        {/* Selector de Tema */}
        <div className="flex items-center gap-3 mt-4 p-2 bg-white/5 rounded-full">
          <span className="text-xs text-cyan-200">{tema === "oscuro" ? t.modoOscuro : t.modoClaro}</span>
          <button
            onClick={toggleTema}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-500 ${
              tema === "oscuro" ? "bg-cyan-600" : "bg-amber-400"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-500 ${
              tema === "oscuro" ? "translate-x-7" : "translate-x-1"
            }`} />
          </button>
        </div>
      </div>

      {/* Usuario */}
      {usuario && (
        <div className={`px-6 py-5 ${tema === "oscuro" ? "bg-slate-800/50" : "bg-slate-700/50"} border-b ${tema === "oscuro" ? "border-slate-700" : "border-slate-600"} text-center backdrop-blur-sm`}>
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{usuario.user}</p>
              <p className="text-xs text-cyan-300">{usuario.rol?.rol || usuario.rol}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
        <p className={sectionTitleClasses}>
          {t.general}
        </p>

        <div className="space-y-2 px-2">
          <Link
            to="/dashboard"
            className={`${linkBaseClasses} ${
              isActiveLink("/dashboard") ? linkActiveClasses : linkInactiveClasses
            }`}
          >
            <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <ChartBarIcon className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="font-medium">{t.dashboard}</span>
            {isActiveLink("/dashboard") && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            )}
          </Link>

          <Link 
            to="/ventas"
            className={`${linkBaseClasses} ${
              isActiveLink("/ventas") ? linkActiveClasses : linkInactiveClasses
            }`}
          >
            <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <CurrencyDollarIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="font-medium">{t.ventas}</span>
          </Link>

          <Link 
            to="/compras"
            className={`${linkBaseClasses} ${
              isActiveLink("/compras") ? linkActiveClasses : linkInactiveClasses
            }`}
          >
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <ShoppingCartIcon className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-medium">{t.compras}</span>
            {isActiveLink("/compras") && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            )}
          </Link>
        </div>

        {/* Administración */}
        <div className="mt-8">
          <p className={sectionTitleClasses}>
            {t.administracion}
          </p>
          
          <button
            onClick={() => setOpenAdmin(!openAdmin)}
            className={`w-full text-left ${linkBaseClasses} ${
              openAdmin ? linkActiveClasses : linkInactiveClasses
            }`}
            aria-expanded={openAdmin}
          >
            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <UserGroupIcon className="h-5 w-5 text-purple-400" />
            </div>
            <span className="font-medium flex-1">{t.administracion}</span>
            <ChevronRightIcon className={`h-4 w-4 text-white transition-transform duration-500 ${openAdmin ? "rotate-90" : ""}`} />
          </button>

          <Collapsible open={openAdmin}>
            <div className="ml-4 mt-2 space-y-1 py-2 border-l-2 border-cyan-400/30">
              <Link
                to="/empleados"
                className={subLinkClasses}
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <UserIcon className="h-4 w-4 text-cyan-400" />
                <span>{t.gestionEmpleados}</span>
              </Link>
              <Link
                to="/proveedores"
                className={subLinkClasses}
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <UserGroupIcon className="h-4 w-4 text-cyan-400" />
                <span>{t.gestionProveedores}</span>
              </Link>
              <Link
                to="/productos"
                className={subLinkClasses}
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <ClipboardDocumentListIcon className="h-4 w-4 text-cyan-400" />
                <span>{t.gestionProductos}</span>
              </Link>
            </div>
          </Collapsible>
        </div>

        {/* Análisis y Configuración */}
        <div className="mt-8">
          <p className={sectionTitleClasses}>
            {t.analisisConfig}
          </p>
          
          <button
            onClick={() => setOpenAnalisis(!openAnalisis)}
            className={`w-full text-left ${linkBaseClasses} ${
              openAnalisis ? linkActiveClasses : linkInactiveClasses
            }`}
            aria-expanded={openAnalisis}
          >
            <div className="p-2 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <ChartPieIcon className="h-5 w-5 text-orange-400" />
            </div>
            <span className="font-medium flex-1">{t.analisisConfig}</span>
            <ChevronRightIcon className={`h-4 w-4 text-white transition-transform duration-500 ${openAnalisis ? "rotate-90" : ""}`} />
          </button>

          <Collapsible open={openAnalisis}>
            <div className="ml-4 mt-2 space-y-1 py-2 border-l-2 border-cyan-400/30">
              <Link
                to="/reportes"
                className={subLinkClasses}
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <DocumentChartBarIcon className="h-4 w-4 text-cyan-400" />
                <span>{t.reportes}</span>
              </Link>
              <Link
                to="/configuracion"
                className={subLinkClasses}
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <Cog6ToothIcon className="h-4 w-4 text-cyan-400" />
                <span>{t.configuracion}</span>
              </Link>
            </div>
          </Collapsible>
        </div>
      </nav>

      {/* Cerrar sesión */}
      <div className={`p-6 border-t ${tema === "oscuro" ? "border-slate-700" : "border-slate-600"} bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm`}>
        <button
          onClick={() => logout()}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl hover:from-rose-500 hover:to-pink-500 transition-all duration-500 w-full font-semibold group transform hover:scale-105 shadow-2xl hover:shadow-rose-500/25"
        >
          <PowerIcon className="h-5 w-5 text-white group-hover:rotate-180 transition-transform duration-500" />
          <span>{t.cerrarSesion}</span>
        </button>
      </div>
    </aside>
  );
}