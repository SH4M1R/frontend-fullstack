import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BellIcon, 
  ShoppingCartIcon, 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Header = ({ onMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', name: 'Dashboard' },
    { path: '/product-list', name: 'Productos' },
    { path: '/add-product', name: 'Agregar Producto' },
    { path: '/sales-report', name: 'Reporte de Ventas' },
  ];

  return (
    <header className={`bg-indigo-700 text-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                onMenuToggle();
              }}
              className="md:hidden p-2 rounded-md hover:bg-indigo-600 transition-colors"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white p-1 rounded-md transition-transform duration-300 hover:scale-105">
                <svg className="h-8 w-8 text-indigo-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                ModaStyle Intranet
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center ${
                  isActiveLink(item.path) 
                    ? 'bg-white text-indigo-700 font-semibold shadow-lg' 
                    : 'hover:bg-indigo-600 hover:shadow-md'
                }`}
              >
                {item.name}
                {isActiveLink(item.path) && (
                  <div className="ml-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <button className="relative p-2 rounded-full hover:bg-indigo-600 transition-colors group">
              <BellIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                3
              </span>
            </button>
            
            <button className="relative p-2 rounded-full hover:bg-indigo-600 transition-colors group">
              <ShoppingCartIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                5
              </span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-600 transition-colors group"
              >
                <UserCircleIcon className="h-7 w-7 transition-transform group-hover:scale-110" />
                <span className="hidden md:block">Usuario</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-800 font-medium">Hola, Usuario</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Configuración
                  </Link>
                  <div className="border-t border-gray-100">
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 bg-indigo-600 rounded-md p-4 animate-slide-in">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`block px-4 py-3 rounded-md transition-all ${
                      isActiveLink(item.path) 
                        ? 'bg-white text-indigo-700 font-semibold' 
                        : 'hover:bg-indigo-500'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;