import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { useGlobalState } from '../store/globalState';

const AddProduct = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setProducts, addNotification } = useGlobalState();

  const handleAddProduct = (productData) => {
    // In a real app, you would send this data to your backend
    const newProduct = {
      id: Date.now(),
      ...productData,
      dateAdded: new Date().toISOString(),
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3 and 5
      reviews: Math.floor(Math.random() * 100),
      stock: Math.floor(Math.random() * 100) + 10
    };
    
    setProducts(prev => [...prev, newProduct]);
    
    addNotification({
      type: 'success',
      message: 'Producto agregado exitosamente',
      autoHide: true,
      duration: 3000
    });
  };

  const features = [
    {
      title: 'Agregar Producto Manualmente',
      description: 'Completa el formulario para agregar un nuevo producto al catálogo.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      ),
      buttonText: 'Agregar Producto',
      action: () => setModalOpen(true),
      color: 'blue'
    },
    {
      title: 'Importar desde CSV',
      description: 'Sube un archivo CSV para importar múltiples productos a la vez.',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
        </svg>
      ),
      buttonText: 'Importar CSV',
      action: () => console.log('Import CSV'),
      color: 'green'
    },
    {
      title: 'Configuración de Inventario',
      description: 'Configura alertas de stock y gestiona categorías.',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826 3.31 2.37 2.37a1.724 1.724 0 002.572 1.065c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.065 2.572c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.065 2.572c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      ),
      buttonText: 'Configurar',
      action: () => console.log('Settings'),
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          icon: 'text-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 md:ml-64 transition-all duration-300">
          <main className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
              <p className="text-gray-600">Agrega y gestiona los productos de tu catálogo</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const colorClasses = getColorClasses(feature.color);
                return (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className={`flex items-center justify-center w-12 h-12 ${colorClasses.bg} rounded-lg mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                    <button 
                      onClick={feature.action}
                      className={`w-full text-white py-2 rounded-lg transition-colors ${colorClasses.button}`}
                    >
                      {feature.buttonText}
                    </button>
                  </div>
                );
              })}
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Productos</p>
                    <p className="text-2xl font-bold text-gray-800">89</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">+5.2% desde el mes pasado</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Productos con Stock Bajo</p>
                    <p className="text-2xl font-bold text-gray-800">7</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-red-600 mt-2">Necesita atención inmediata</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categorías Activas</p>
                    <p className="text-2xl font-bold text-gray-800">5</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Camisetas, Pantalones, Vestidos, Accesorios, Zapatos</p>
              </div>
            </div>
            
            <Modal 
              isOpen={isModalOpen} 
              onClose={() => setModalOpen(false)} 
              onAddProduct={handleAddProduct}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;