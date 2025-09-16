import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  Squares2X2Icon, 
  PlusCircleIcon, 
  ChartBarIcon, 
  ArrowRightStartOnRectangleIcon 
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

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
            <div className="bg-white p-2 rounded-lg">
              <svg className="h-8 w-8 text-indigo-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold">ModaStyle</h1>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
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
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;