import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import { useGlobalState } from '../store/globalState';
import { 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const ProductList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { products } = useGlobalState();
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filtrado de productos
  useEffect(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Ordenar productos
    result.sort((a, b) => {
      switch(sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const categories = ['all', 'camisetas', 'pantalones', 'vestidos', 'accesorios', 'zapatos'];

  const handleAddToCart = (product) => {
    // Lógica para agregar al carrito
    console.log('Agregado al carrito:', product);
  };

  const handleQuickView = (product) => {
    // Lógica para vista rápida
    console.log('Vista rápida:', product);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('name');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 md:ml-64 transition-all duration-300">
          <main className="p-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h2>
                <p className="text-gray-600">{filteredProducts.length} productos encontrados</p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="relative flex-1 md:flex-initial">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-64 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 rounded-lg md:hidden ${isFilterOpen ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                  >
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filtros */}
              <div className={`lg:col-span-1 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Filtros</h3>
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  <div className="space-y-6">
                    {/* Categorías */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Categorías</h4>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <label key={category} className="flex items-center">
                            <input
                              type="radio"
                              name="category"
                              value={category}
                              checked={selectedCategory === category}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-gray-700 capitalize">{category === 'all' ? 'Todas' : category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Rango de Precios */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Rango de Precios</h4>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ordenar por */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Ordenar por</h4>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="name">Nombre (A-Z)</option>
                        <option value="price-low">Precio (Menor a Mayor)</option>
                        <option value="price-high">Precio (Mayor a Menor)</option>
                        <option value="newest">Más Recientes</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={clearFilters}
                      className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Lista de Productos */}
              <div className="lg:col-span-3">
                {filteredProducts.length === 0 ? (
                  <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16"></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                    <p className="text-gray-500 mb-4">Intenta ajustar tus filtros de búsqueda</p>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={handleQuickView}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors animate-fade-in">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={product.image || '/placeholder-image.jpg'}
                              alt={product.name}
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{product.description}</p>
                            <div className="flex items-center mt-1">
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                                {product.category}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">{product.size}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-indigo-700">${product.price}</span>
                            <div className="flex space-x-2 mt-2">
                              <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleAddToCart(product)}
                                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                              >
                                <ShoppingCartIcon className="h-5 w-5" />
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductList;