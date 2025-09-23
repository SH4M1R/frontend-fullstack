import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const SalesReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [showFilters, setShowFilters] = useState(false);

  // Datos de ejemplo para el reporte
  const salesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    values: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 35000, 40000, 38000, 45000]
  };

  const topProducts = [
    { name: 'Camiseta Básica', sales: 1245, revenue: 18675 },
    { name: 'Jeans Slim Fit', sales: 987, revenue: 34545 },
    { name: 'Vestido Floral', sales: 756, revenue: 22680 },
    { name: 'Chaqueta Denim', sales: 543, revenue: 27150 },
    { name: 'Zapatos Deportivos', sales: 432, revenue: 17280 }
  ];

  const metrics = [
    { label: 'Ventas Totales', value: '12,456', change: '+12.5%', trend: 'up' },
    { label: 'Ingresos', value: '$186,840', change: '+15.3%', trend: 'up' },
    { label: 'Clientes', value: '3,452', change: '+8.7%', trend: 'up' },
    { label: 'Ticket Promedio', value: '$54.32', change: '+2.4%', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 md:ml-64 transition-all duration-300">
          <main className="p-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Reporte de Ventas</h2>
                <p className="text-gray-600">Análisis y estadísticas de ventas</p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>Exportar</span>
                </button>
                
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <CalendarIcon className="h-5 w-5" />
                    <span className="capitalize">{dateRange}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-fade-in">
                      <button
                        onClick={() => { setDateRange('day'); setShowFilters(false); }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        Día
                      </button>
                      <button
                        onClick={() => { setDateRange('week'); setShowFilters(false); }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        Semana
                      </button>
                      <button
                        onClick={() => { setDateRange('month'); setShowFilters(false); }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        Mes
                      </button>
                      <button
                        onClick={() => { setDateRange('year'); setShowFilters(false); }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        Año
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
                  <div className={`flex items-center mt-2 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gráfico de Ventas */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800">Ventas Mensuales</h3>
                  <ChartBarIcon className="h-5 w-5 text-gray-600" />
                </div>
                
                <div className="h-64">
                  <div className="flex items-end justify-between h-full space-x-1">
                    {salesData.values.map((value, index) => {
                      const height = (value / 50000) * 100;
                      return (
                        <div key={index} className="flex flex-col items-center flex-1 group">
                          <div
                            className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg transition-all duration-300 hover:from-indigo-600 hover:to-indigo-400 group-hover:opacity-90"
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="text-xs text-gray-600 mt-2 group-hover:text-indigo-600 transition-colors">{salesData.labels[index]}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                            ${value.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600">Total del período</p>
                    <p className="text-xl font-bold text-gray-800">$326,540</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">+15.3% vs período anterior</p>
                    <p className="text-xs text-gray-600">Mayor crecimiento en 12 meses</p>
                  </div>
                </div>
              </div>
              
              {/* Productos Más Vendidos */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-6">Productos Más Vendidos</h3>
                
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-700">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} unidades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${product.revenue.toLocaleString()}</p>
                        <p className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 text-indigo-600 hover:text-indigo-800 text-sm font-medium py-3 border-t border-gray-100 flex items-center justify-center">
                  Ver todos los productos
                </button>
              </div>
            </div>
            
            {/* Tabla de Ventas Detalladas */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Ventas Detalladas</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidades</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tendencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors animate-fade-in">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{product.name.split(' ')[0].toLowerCase()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.sales}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            +{Math.floor(Math.random() * 20) + 5}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;