import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, ShoppingCartIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-indigo-600 transition-colors"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white p-1 rounded-md">
                <svg className="h-8 w-8 text-indigo-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">ModaStyle Intranet</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-md transition-all duration-300 ${isActiveLink('/') ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-600'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/product-list" 
              className={`px-4 py-2 rounded-md transition-all duration-300 ${isActiveLink('/product-list') ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-600'}`}
            >
              Productos
            </Link>
            <Link 
              to="/add-product" 
              className={`px-4 py-2 rounded-md transition-all duration-300 ${isActiveLink('/add-product') ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-600'}`}
            >
              Agregar Producto
            </Link>
            <Link 
              to="/sales-report" 
              className={`px-4 py-2 rounded-md transition-all duration-300 ${isActiveLink('/sales-report') ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-600'}`}
            >
              Reporte de Ventas
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-indigo-600 transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>
            
            <button className="relative p-2 rounded-full hover:bg-indigo-600 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">5</span>
            </button>
            
            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-600 transition-colors">
              <UserCircleIcon className="h-7 w-7" />
              <span className="hidden md:block">Usuario</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 bg-indigo-600 rounded-md p-4 animate-fade-in">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`block px-4 py-2 rounded-md ${isActiveLink('/') ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/product-list" 
                  className={`block px-4 py-2 rounded-md ${isActiveLink('/product-list') ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link 
                  to="/add-product" 
                  className={`block px-4 py-2 rounded-md ${isActiveLink('/add-product') ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agregar Producto
                </Link>
              </li>
              <li>
                <Link 
                  to="/sales-report" 
                  className={`block px-4 py-2 rounded-md ${isActiveLink('/sales-report') ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reporte de Ventas
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;