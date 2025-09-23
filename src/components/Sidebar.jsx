import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  Squares2X2Icon, 
  PlusCircleIcon, 
  ChartBarIcon, 
  ArrowRightStartOnRectangleIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: HomeIcon },
    { path: '/product-list', name: 'Productos', icon: Squares2X2Icon },
    { path: '/add-product', name: 'Agregar Producto', icon: PlusCircleIcon },
    { path: '/sales-report', name: 'Reporte de Ventas', icon: ChartBarIcon },
  ];

  const secondaryMenuItems = [
    { path: '/profile', name: 'Perfil', icon: UserIcon },
    { path: '/settings', name: 'Configuración', icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fade-in"
          onClick={onClose}
        ></div>
      )}
      
      <div className={`
        fixed md:sticky top-0 left-0 h-screen bg-gradient-to-b from-indigo-800 to-indigo-900 text-white 
        w-64 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-indigo-700">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <svg className="h-8 w-8 text-indigo-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">ModaStyle</h1>
              <p className="text-xs text-indigo-200">Panel de administración</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs uppercase text-indigo-400 font-semibold mb-3 pl-3">Principal</p>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                        ${isActiveLink(item.path) 
                          ? 'bg-white text-indigo-700 shadow-md' 
                          : 'hover:bg-indigo-700'}
                      `}
                      onClick={() => window.innerWidth < 768 && onClose()}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{item.name}</span>
                      {isActiveLink(item.path) && (
                        <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="mb-6">
            <p className="text-xs uppercase text-indigo-400 font-semibold mb-3 pl-3">Cuenta</p>
            <ul className="space-y-1">
              {secondaryMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                        ${isActiveLink(item.path) 
                          ? 'bg-white text-indigo-700 shadow-md' 
                          : 'hover:bg-indigo-700'}
                      `}
                      onClick={() => window.innerWidth < 768 && onClose()}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center space-x-3 mb-4 px-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Usuario Admin</p>
              <p className="text-xs text-indigo-300">admin@modastyle.com</p>
            </div>
          </div>
          
          <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors group">
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;