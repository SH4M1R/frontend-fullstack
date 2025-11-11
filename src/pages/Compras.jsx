import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import CompraService from "../services/CompraService";
import { 
  ShoppingCartIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function Compras() {
  const { tema, idioma } = useTheme();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("todos");

  // Traducciones
  const traducciones = {
    es: {
      titulo: "Gestión de Compras",
      subtitulo: "Administra las compras de productos a proveedores",
      nuevaCompra: "Nueva Compra",
      totalCompras: "Total Compras",
      proveedoresActivos: "Proveedores Activos",
      empleadosInvolucrados: "Empleados Involucrados",
      historialCompras: "Historial de Compras",
      filtrar: "Filtrar",
      buscar: "Buscar compras...",
      todos: "Todos",
      recientes: "Recientes",
      antiguos: "Antiguos",
      noCompras: "No hay compras registradas",
      comenzarRegistro: "Comienza registrando tu primera compra",
      crearPrimeraCompra: "Crear Primera Compra",
      compra: "Compra",
      proveedor: "Proveedor",
      empleado: "Empleado",
      fecha: "Fecha",
      total: "Total",
      acciones: "Acciones",
      eliminarConfirmacion: "¿Estás seguro de que quieres eliminar esta compra?",
      errorCargar: "Error al cargar las compras. Verifica que el servidor esté funcionando.",
      errorEliminar: "Error al eliminar la compra",
      verDetalles: "Ver detalles",
      editar: "Editar",
      eliminar: "Eliminar",
      recargar: "Recargar",
      errorConexion: "Error de conexión con el servidor"
    },
    en: {
      titulo: "Purchase Management",
      subtitulo: "Manage product purchases from suppliers",
      nuevaCompra: "New Purchase",
      totalCompras: "Total Purchases",
      proveedoresActivos: "Active Suppliers",
      empleadosInvolucrados: "Involved Employees",
      historialCompras: "Purchase History",
      filtrar: "Filter",
      buscar: "Search purchases...",
      todos: "All",
      recientes: "Recent",
      antiguos: "Old",
      noCompras: "No purchases registered",
      comenzarRegistro: "Start by registering your first purchase",
      crearPrimeraCompra: "Create First Purchase",
      compra: "Purchase",
      proveedor: "Supplier",
      empleado: "Employee",
      fecha: "Date",
      total: "Total",
      acciones: "Actions",
      eliminarConfirmacion: "Are you sure you want to delete this purchase?",
      errorCargar: "Error loading purchases. Please check if the server is running.",
      errorEliminar: "Error deleting purchase",
      verDetalles: "View details",
      editar: "Edit",
      eliminar: "Delete",
      recargar: "Reload",
      errorConexion: "Server connection error"
    }
  };

  const t = traducciones[idioma];

  const cargarCompras = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Cargando compras...");
      const res = await CompraService.getAllCompras();
      console.log("✅ Compras cargadas:", res.data);
      setCompras(res.data || []);
    } catch (error) {
      console.error("❌ Error al cargar las compras:", error);
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        setError(t.errorConexion + " - Verifica que el backend esté ejecutándose en puerto 8500");
      } else {
        setError(t.errorCargar);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCompras();
  }, [idioma]);

  const handleEliminarCompra = async (id) => {
    if (window.confirm(t.eliminarConfirmacion)) {
      try {
        await CompraService.deleteCompra(id);
        cargarCompras();
      } catch (error) {
        console.error("Error al eliminar la compra:", error);
        setError(t.errorEliminar);
      }
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    try {
      return new Date(fecha).toLocaleDateString(idioma === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const formatearMoneda = (monto) => {
    if (!monto) return "S/ 0.00";
    return new Intl.NumberFormat(idioma === 'es' ? 'es-PE' : 'en-US', {
      style: 'currency',
      currency: 'PEN'
    }).format(monto);
  };

  // Filtrar compras con manejo seguro de undefined
  const comprasFiltradas = compras.filter(compra => {
    const nombreProveedor = compra?.proveedor?.nombre || '';
    const nombreEmpleado = compra?.empleado?.user || '';
    
    const coincideBusqueda = 
      nombreProveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      nombreEmpleado.toLowerCase().includes(busqueda.toLowerCase());
    
    if (filtroActivo === "recientes") {
      try {
        const fechaCompra = new Date(compra.fechaCompra);
        const unaSemanaAtras = new Date();
        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
        return coincideBusqueda && fechaCompra >= unaSemanaAtras;
      } catch {
        return coincideBusqueda;
      }
    } else if (filtroActivo === "antiguos") {
      try {
        const fechaCompra = new Date(compra.fechaCompra);
        const unMesAtras = new Date();
        unMesAtras.setMonth(unMesAtras.getMonth() - 1);
        return coincideBusqueda && fechaCompra < unMesAtras;
      } catch {
        return coincideBusqueda;
      }
    }
    
    return coincideBusqueda;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        tema === 'oscuro' ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={`text-lg ${tema === 'oscuro' ? 'text-cyan-400' : 'text-cyan-600'}`}>
            Cargando compras...
          </p>
        </div>
      </div>
    );
  }

  const containerClasses = `min-h-screen transition-all duration-500 ${
    tema === 'oscuro' 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-900'
  }`;

  const cardClasses = `rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 ${
    tema === 'oscuro' 
      ? 'bg-slate-800/80 border border-slate-700' 
      : 'bg-white/80 border border-white'
  }`;

  return (
    <div className={containerClasses}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {t.titulo}
              </h1>
              <p className={`text-lg mt-2 ${tema === 'oscuro' ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.subtitulo}
              </p>
            </div>
            <Link
              to="/compras/crear"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              {t.nuevaCompra}
            </Link>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={cardClasses}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <ShoppingCartIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{t.totalCompras}</p>
                    <p className="text-2xl font-bold text-gray-900">{compras.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={cardClasses}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <TruckIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{t.proveedoresActivos}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {[...new Set(compras.map(c => c.proveedor?.idProveedor).filter(Boolean))].length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={cardClasses}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{t.empleadosInvolucrados}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {[...new Set(compras.map(c => c.empleado?.idEmpleado).filter(Boolean))].length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className={`mb-6 p-6 rounded-2xl border-2 ${
              tema === 'oscuro' 
                ? 'bg-red-900/50 border-red-700 text-red-200' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-semibold">{error}</p>
                    <p className="text-sm mt-1">
                      Asegúrate de que el servidor backend esté ejecutándose en http://localhost:8500
                    </p>
                  </div>
                </div>
                <button
                  onClick={cargarCompras}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  {t.recargar}
                </button>
              </div>
            </div>
          )}

          {/* Controles de Filtro y Búsqueda */}
          <div className={`${cardClasses} p-6 mb-8`}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full lg:w-auto">
                <input
                  type="text"
                  placeholder={t.buscar}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                    tema === 'oscuro'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-cyan-500'
                  }`}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltroActivo("todos")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filtroActivo === "todos" 
                      ? tema === 'oscuro' 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-cyan-500 text-white'
                      : tema === 'oscuro'
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {t.todos}
                </button>
                <button
                  onClick={() => setFiltroActivo("recientes")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filtroActivo === "recientes" 
                      ? tema === 'oscuro' 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-cyan-500 text-white'
                      : tema === 'oscuro'
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {t.recientes}
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Compras */}
          <div className={cardClasses}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {t.historialCompras}
                </h2>
              </div>

              {comprasFiltradas.length === 0 && !error ? (
                <div className="text-center py-16">
                  <ShoppingCartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t.noCompras}</h3>
                  <p className={`mb-6 ${tema === 'oscuro' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t.comenzarRegistro}
                  </p>
                  <Link 
                    to="/compras/crear" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                  >
                    <PlusIcon className="h-5 w-5" />
                    {t.crearPrimeraCompra}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {comprasFiltradas.map((compra, index) => (
                    <div 
                      key={compra.idCompra || index} 
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        tema === 'oscuro'
                          ? 'bg-slate-700/50 border-slate-600 hover:border-cyan-500/50'
                          : 'bg-white border-slate-200 hover:border-cyan-300'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                              tema === 'oscuro' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                            }`}>
                              <ShoppingCartIcon className="h-6 w-6 text-cyan-500" />
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${tema === 'oscuro' ? 'text-slate-400' : 'text-slate-600'}`}>
                                {t.compra}
                              </p>
                              <p className="font-semibold text-lg">
                                #{compra.idCompra || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                              tema === 'oscuro' ? 'bg-emerald-500/20' : 'bg-emerald-100'
                            }`}>
                              <TruckIcon className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${tema === 'oscuro' ? 'text-slate-400' : 'text-slate-600'}`}>
                                {t.proveedor}
                              </p>
                              <p className="font-semibold">{compra.proveedor?.nombre || 'No especificado'}</p>
                              <p className="text-sm opacity-70">{compra.proveedor?.contacto || ''}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                              tema === 'oscuro' ? 'bg-purple-500/20' : 'bg-purple-100'
                            }`}>
                              <UserIcon className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${tema === 'oscuro' ? 'text-slate-400' : 'text-slate-600'}`}>
                                {t.empleado}
                              </p>
                              <p className="font-semibold">{compra.empleado?.user || 'No especificado'}</p>
                              <p className="text-sm opacity-70">{compra.empleado?.username || ''}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center gap-4 justify-between">
                          <div className="text-right">
                            <p className={`text-sm ${tema === 'oscuro' ? 'text-slate-400' : 'text-slate-600'}`}>
                              {formatearFecha(compra.fechaCompra)}
                            </p>
                            <p className="text-2xl font-bold text-green-500">
                              {formatearMoneda(compra.total)}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to={`/compras/editar/${compra.idCompra}`}
                              className={`p-3 rounded-xl transition-all duration-300 ${
                                tema === 'oscuro' 
                                  ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
                                  : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
                              }`}
                              title={t.editar}
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              className={`p-3 rounded-xl transition-all duration-300 ${
                                tema === 'oscuro' 
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                              onClick={() => handleEliminarCompra(compra.idCompra)}
                              title={t.eliminar}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}