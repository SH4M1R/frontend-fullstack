import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenue: 0
  });

  // Simulación de datos del dashboard
  useEffect(() => {
    // En una aplicación real, estos datos vendrían de una API
    const simulatedData = {
      totalSales: 1245,
      totalProducts: 89,
      totalCustomers: 342,
      revenue: 45236.50
    };
    
    // Animación de contadores
    const interval = setInterval(() => {
      setStats(prev => ({
        totalSales: Math.min(prev.totalSales + 25, simulatedData.totalSales),
        totalProducts: Math.min(prev.totalProducts + 5, simulatedData.totalProducts),
        totalCustomers: Math.min(prev.totalCustomers + 10, simulatedData.totalCustomers),
        revenue: Math.min(prev.revenue + 1000, simulatedData.revenue)
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      title: 'Ventas Totales',
      value: stats.totalSales,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      trend: 'up',
      change: '+12.5%'
    },
    {
      title: 'Productos',
      value: stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      trend: 'up',
      change: '+5.2%'
    },
    {
      title: 'Clientes',
      value: stats.totalCustomers,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      trend: 'up',
      change: '+8.7%'
    },
    {
      title: 'Ingresos',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      trend: 'up',
      change: '+15.3%'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Nuevo pedido', user: 'Juan Pérez', time: 'Hace 2 min', type: 'sale' },
    { id: 2, action: 'Producto agregado', user: 'María García', time: 'Hace 15 min', type: 'product' },
    { id: 3, action: 'Usuario registrado', user: 'Carlos López', time: 'Hace 30 min', type: 'user' },
    { id: 4, action: 'Pago procesado', user: 'Ana Martínez', time: 'Hace 45 min', type: 'payment' },
    { id: 5, action: 'Producto agotado', user: 'Sistema', time: 'Hace 1 h', type: 'alert' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return '🛒';
      case 'product': return '📦';
      case 'user': return '👤';
      case 'payment': return '💳';
      case 'alert': return '⚠️';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 md:ml-64">
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Resumen general de tu negocio</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        <div className={`flex items-center mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend === 'up' ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start">
                      <span className="text-xl mr-3 mt-1">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user} · {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Ver toda la actividad
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                    <div className="p-2 bg-indigo-100 rounded-full mb-2">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-indigo-700">Agregar Producto</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="p-2 bg-green-100 rounded-full mb-2">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-green-700">Ver Inventario</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="p-2 bg-purple-100 rounded-full mb-2">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-purple-700">Reportes</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                    <div className="p-2 bg-yellow-100 rounded-full mb-2">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-yellow-700">Soporte</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;