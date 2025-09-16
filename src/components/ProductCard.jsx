import React, { useState } from 'react';
import { EyeIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleQuickView = () => {
    onQuickView(product);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <div className={`h-60 bg-gray-200 flex items-center justify-center ${!imageLoaded ? 'animate-pulse' : ''}`}>
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          {!product.image && (
            <div className="text-gray-400">
              <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
              </svg>
            </div>
          )}
        </div>
        
        <div className="absolute top-2 right-2">
          <button 
            onClick={handleLike}
            className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
            aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {isLiked ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button 
              onClick={handleQuickView}
              className="p-3 bg-white rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
              aria-label="Vista rápida"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={handleAddToCart}
              className="p-3 bg-white rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"
              aria-label="Agregar al carrito"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-indigo-700">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>{product.rating || '4.5'}</span>
          </div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;