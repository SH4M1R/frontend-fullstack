import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingBagIcon, CurrencyDollarIcon, UserGroupIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ClockIcon, ChartBarIcon, PlusIcon
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenue: 0,
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const resStats = await axios.get("http://localhost:8500/api/dashboard/stats");
        setStats({
          totalSales: resStats.data.totalSales,
          totalProducts: resStats.data.totalProducts,
          totalCustomers: resStats.data.totalCustomers,
          revenue: resStats.data.revenue,
        });

        const resActivities = await axios.get("http://localhost:8500/api/dashboard/activities");
        setActivities(resActivities.data);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    cargarDashboard();
  }, []);

  const statsData = [
    { title: "Ventas Totales", value: stats.totalSales, icon: ShoppingBagIcon, color: "bg-blue-500", trend: "up", change: "+12.5%",},
    { title: "Productos", value: stats.totalProducts, icon: ShoppingBagIcon, color: "bg-green-500", trend: "up", change: "+5.2%", },
    { title: "Clientes", value: stats.totalCustomers, icon: UserGroupIcon, color: "bg-purple-500", trend: "up", change: "+8.7%", },
    { title: "Ingresos", value: `S/ ${Number(stats.revenue).toLocaleString()}`, icon: CurrencyDollarIcon, color: "bg-yellow-500", trend: "up", change: "+15.3%", },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "sale": return "🛒";
      case "product": return "📦";
      case "user": return "👤";
      case "payment": return "💳";
      case "alert": return "⚠️";
      default: return "📝";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "sale":
        return "text-blue-600 bg-blue-100";
      case "product":
        return "text-green-600 bg-green-100";
      case "user":
        return "text-purple-600 bg-purple-100";
      case "payment":
        return "text-yellow-600 bg-yellow-100";
      case "alert":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    <div
                      className={`flex items-center mt-2 ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-sm font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Actividad Reciente</h2>
              <ClockIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start animate-fade-in">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getActivityColor(activity.type)} mr-3`}>
                    {getActivityIcon(activity.type)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user || "Sistema"}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(activity.time).toLocaleString() || "Hace poco"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Acciones Rápidas</h2>
              <ChartBarIcon className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Agregar Producto */}
              <Link
                to="/productos"
                className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-2 bg-indigo-100 rounded-full mb-2">
                  <PlusIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-indigo-700">Agregar Producto</span>
              </Link>

              {/* Realizar Venta */}
              <Link
                to="/ventas"
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-2 bg-green-100 rounded-full mb-2">
                  <ShoppingBagIcon className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-700">Realizar Venta</span>
              </Link>

              {/* Reportes */}
              <Link
                to="/reportes"
                className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-2 bg-purple-100 rounded-full mb-2">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-700">Reportes</span>
              </Link>

              {/* Agregar Empleado */}
              <Link
                to="/empleados"
                className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-2 bg-yellow-100 rounded-full mb-2">
                  <UserGroupIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-yellow-700">Agregar Empleado</span>
              </Link>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
};

export default Dashboard;