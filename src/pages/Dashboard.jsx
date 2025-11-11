import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import DashboardService from "../services/DashboardService";
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ChartBarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { tema, idioma } = useTheme();
  const [estadisticas, setEstadisticas] = useState(null);
  const [actividadReciente, setActividadReciente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [graficoCargando, setGraficoCargando] = useState(true);

  // Traducciones
  const traducciones = {
    es: {
      titulo: "Dashboard Principal",
      subtitulo: "Resumen general de tu negocio",
      ventasMes: "Ventas del Mes",
      totalVentas: "Total Ventas",
      totalProductos: "Total Productos",
      productosBajoStock: "Bajo Stock",
      totalClientes: "Total Clientes",
      comprasMes: "Compras del Mes",
      balance: "Balance Neto",
      actividadReciente: "Actividad Reciente",
      ultimasVentas: "Últimas Ventas",
      productosRecientes: "Productos Recientes",
      comprasRecientes: "Compras Recientes",
      verTodo: "Ver Todo",
      cargando: "Cargando datos...",
      errorCarga: "Error al cargar datos",
      recargar: "Recargar",
      tendenciaAlta: "en alza",
      tendenciaBaja: "en baja",
      saludNegocio: "Salud del Negocio",
      excelente: "Excelente",
      bueno: "Bueno",
      necesitaAtencion: "Necesita Atención"
    },
    en: {
      titulo: "Main Dashboard",
      subtitulo: "Overview of your business",
      ventasMes: "Monthly Sales",
      totalVentas: "Total Sales",
      totalProductos: "Total Products",
      productosBajoStock: "Low Stock",
      totalClientes: "Total Customers",
      comprasMes: "Monthly Purchases",
      balance: "Net Balance",
      actividadReciente: "Recent Activity",
      ultimasVentas: "Recent Sales",
      productosRecientes: "Recent Products",
      comprasRecientes: "Recent Purchases",
      verTodo: "View All",
      cargando: "Loading data...",
      errorCarga: "Error loading data",
      recargar: "Reload",
      tendenciaAlta: "trending up",
      tendenciaBaja: "trending down",
      saludNegocio: "Business Health",
      excelente: "Excellent",
      bueno: "Good",
      necesitaAtencion: "Needs Attention"
    }
  };

  const t = traducciones[idioma];

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setCargando(true);
      const [estadisticasRes, actividadRes] = await Promise.all([
        DashboardService.getEstadisticas(),
        DashboardService.getActividadReciente()
      ]);
      
      setEstadisticas(estadisticasRes.data);
      setActividadReciente(actividadRes.data);
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    } finally {
      setCargando(false);
      setGraficoCargando(false);
    }
  };

  const calcularSaludNegocio = () => {
    if (!estadisticas) return { nivel: "neutral", porcentaje: 0 };
    
    const ventas = estadisticas.ventasMesActual || 0;
    const balance = estadisticas.balance || 0;
    const productosBajoStock = estadisticas.productosBajoStock || 0;
    const totalProductos = estadisticas.totalProductos || 1;
    
    let score = 0;
    
    // Ventas positivas +30
    if (ventas > 1000) score += 30;
    else if (ventas > 500) score += 20;
    else if (ventas > 100) score += 10;
    
    // Balance positivo +40
    if (balance > 0) score += 40;
    
    // Stock saludable +30
    const ratioStock = (productosBajoStock / totalProductos) * 100;
    if (ratioStock < 10) score += 30;
    else if (ratioStock < 20) score += 20;
    else if (ratioStock < 30) score += 10;
    
    if (score >= 80) return { nivel: "excelente", porcentaje: score };
    if (score >= 60) return { nivel: "bueno", porcentaje: score };
    return { nivel: "necesitaAtencion", porcentaje: score };
  };

  const saludNegocio = calcularSaludNegocio();

  if (cargando) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        tema === 'oscuro' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className={`text-lg ${tema === 'oscuro' ? 'text-white' : 'text-gray-700'}`}>
            {t.cargando}
          </p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: t.ventasMes,
      value: `$${(estadisticas?.ventasMesActual || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "from-green-500 to-emerald-600",
      trend: estadisticas?.ventasMesActual > 0 ? "up" : "down",
      change: "+12.5%",
      delay: "100"
    },
    {
      title: t.totalVentas,
      value: estadisticas?.totalVentasMes || 0,
      icon: ShoppingBagIcon,
      color: "from-blue-500 to-cyan-600",
      trend: "up",
      change: "+8.7%",
      delay: "200"
    },
    {
      title: t.totalProductos,
      value: estadisticas?.totalProductos || 0,
      icon: CubeIcon,
      color: "from-purple-500 to-indigo-600",
      trend: "up",
      change: "+5.2%",
      delay: "300"
    },
    {
      title: t.productosBajoStock,
      value: estadisticas?.productosBajoStock || 0,
      icon: ExclamationTriangleIcon,
      color: "from-orange-500 to-red-600",
      trend: estadisticas?.productosBajoStock > 5 ? "down" : "up",
      change: estadisticas?.productosBajoStock > 5 ? "-3.1%" : "+1.2%",
      delay: "400"
    },
    {
      title: t.totalClientes,
      value: estadisticas?.totalClientes || 0,
      icon: UserGroupIcon,
      color: "from-pink-500 to-rose-600",
      trend: "up",
      change: "+4.1%",
      delay: "500"
    },
    {
      title: t.comprasMes,
      value: `$${(estadisticas?.comprasMesActual || 0).toLocaleString()}`,
      icon: ChartBarIcon,
      color: "from-yellow-500 to-amber-600",
      trend: "down",
      change: "-2.3%",
      delay: "600"
    }
  ];

  const CardEstadistica = ({ stat, index }) => {
    const IconComponent = stat.icon;
    return (
      <div
        className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in-up`}
        style={{ animationDelay: `${stat.delay}ms` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90`}></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className={`flex items-center ${
            stat.trend === "up" ? "text-green-200" : "text-red-200"
          }`}>
            {stat.trend === "up" ? (
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {stat.change} {stat.trend === "up" ? t.tendenciaAlta : t.tendenciaBaja}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      tema === 'oscuro' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${
            tema === 'oscuro' 
              ? 'from-indigo-400 to-purple-400' 
              : 'from-indigo-600 to-purple-600'
          } bg-clip-text text-transparent animate-fade-in`}>
            {t.titulo}
          </h1>
          <p className={`text-lg ${tema === 'oscuro' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.subtitulo}
          </p>
        </div>

        {/* Balance y Salud del Negocio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Neto */}
          <div className={`col-span-2 rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl ${
            tema === 'oscuro' 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
              : 'bg-gradient-to-r from-white to-gray-50'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${
                tema === 'oscuro' ? 'text-white' : 'text-gray-800'
              }`}>
                {t.balance}
              </h2>
              <CurrencyDollarIcon className={`h-6 w-6 ${
                tema === 'oscuro' ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
            </div>
            <p className={`text-3xl font-bold mb-2 ${
              (estadisticas?.balance || 0) >= 0 
                ? tema === 'oscuro' ? 'text-green-400' : 'text-green-600'
                : tema === 'oscuro' ? 'text-red-400' : 'text-red-600'
            }`}>
              ${(estadisticas?.balance || 0).toLocaleString()}
            </p>
            <p className={`text-sm ${
              tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {estadisticas?.balance >= 0 ? 'Ganancias netas este mes' : 'Pérdidas netas este mes'}
            </p>
          </div>

          {/* Salud del Negocio */}
          <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl ${
            tema === 'oscuro' 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
              : 'bg-gradient-to-r from-white to-gray-50'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${
                tema === 'oscuro' ? 'text-white' : 'text-gray-800'
              }`}>
                {t.saludNegocio}
              </h2>
              <div className={`p-2 rounded-full ${
                saludNegocio.nivel === 'excelente' ? 'bg-green-500/20 text-green-400' :
                saludNegocio.nivel === 'bueno' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                <ChartBarIcon className="h-4 w-4" />
              </div>
            </div>
            <div className="mb-3">
              <div className={`w-full bg-gray-200 rounded-full h-2 ${
                tema === 'oscuro' ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    saludNegocio.nivel === 'excelente' ? 'bg-green-500' :
                    saludNegocio.nivel === 'bueno' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${saludNegocio.porcentaje}%` }}
                ></div>
              </div>
            </div>
            <p className={`text-sm font-medium ${
              saludNegocio.nivel === 'excelente' ? 
                tema === 'oscuro' ? 'text-green-400' : 'text-green-600' :
              saludNegocio.nivel === 'bueno' ? 
                tema === 'oscuro' ? 'text-yellow-400' : 'text-yellow-600' :
                tema === 'oscuro' ? 'text-red-400' : 'text-red-600'
            }`}>
              {t[saludNegocio.nivel]} • {saludNegocio.porcentaje}%
            </p>
          </div>
        </div>

        {/* Grid de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <CardEstadistica key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Actividad Reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Últimas Ventas */}
          <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl ${
            tema === 'oscuro' 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
              : 'bg-gradient-to-r from-white to-gray-50'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${
                tema === 'oscuro' ? 'text-white' : 'text-gray-800'
              }`}>
                {t.ultimasVentas}
              </h2>
              <ClockIcon className={`h-5 w-5 ${
                tema === 'oscuro' ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
            </div>
            <div className="space-y-4">
              {actividadReciente?.ultimasVentas?.slice(0, 5).map((venta, index) => (
                <div 
                  key={venta.idVenta} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                    tema === 'oscuro' 
                      ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  } animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      tema === 'oscuro' ? 'bg-indigo-500/20' : 'bg-indigo-100'
                    }`}>
                      <ShoppingBagIcon className={`h-4 w-4 ${
                        tema === 'oscuro' ? 'text-indigo-400' : 'text-indigo-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        tema === 'oscuro' ? 'text-white' : 'text-gray-800'
                      }`}>
                        Venta #{venta.idVenta}
                      </p>
                      <p className={`text-sm ${
                        tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {venta.empleado?.user || 'Sistema'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tema === 'oscuro' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ${venta.total?.toLocaleString() || '0'}
                    </p>
                    <p className={`text-xs ${
                      tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {new Date(venta.fechaVenta).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Productos Recientes */}
          <div className={`rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl ${
            tema === 'oscuro' 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
              : 'bg-gradient-to-r from-white to-gray-50'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${
                tema === 'oscuro' ? 'text-white' : 'text-gray-800'
              }`}>
                {t.productosRecientes}
              </h2>
              <CubeIcon className={`h-5 w-5 ${
                tema === 'oscuro' ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
            </div>
            <div className="space-y-4">
              {actividadReciente?.productosRecientes?.slice(0, 5).map((producto, index) => (
                <div 
                  key={producto.idProducto} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                    tema === 'oscuro' 
                      ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  } animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      producto.stock < 10 
                        ? tema === 'oscuro' ? 'bg-red-500/20' : 'bg-red-100'
                        : tema === 'oscuro' ? 'bg-green-500/20' : 'bg-green-100'
                    }`}>
                      <CubeIcon className={`h-4 w-4 ${
                        producto.stock < 10 
                          ? tema === 'oscuro' ? 'text-red-400' : 'text-red-600'
                          : tema === 'oscuro' ? 'text-green-400' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        tema === 'oscuro' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {producto.producto}
                      </p>
                      <p className={`text-sm ${
                        tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Stock: {producto.stock}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tema === 'oscuro' ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>
                      ${producto.precioVenta?.toLocaleString() || '0'}
                    </p>
                    <p className={`text-xs ${
                      tema === 'oscuro' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {producto.categoria?.categoria || 'Sin categoría'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;