import React, { useState } from 'react';
import { EyeIcon, ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    onAddToCart(product);
    setIsAddingToCart(false);
  };

  const handleQuickView = () => {
    onQuickView(product);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarSolid key={i} className="h-4 w-4 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-yellow-400" />);
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <div className={`h-60 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${!imageLoaded ? 'animate-pulse' : ''}`}>
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
            className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors transform hover:scale-110"
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
              disabled={isAddingToCart}
              className="p-3 bg-white rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75 disabled:opacity-50"
              aria-label="Agregar al carrito"
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              ) : (
                <ShoppingCartIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md animate-pulse">
            -{product.discount}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 truncate flex-1">{product.name}</h3>
          <div className="flex items-center ml-2">
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{product.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-lg font-bold text-indigo-700">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="flex">
              {renderRatingStars(product.rating || 4.5)}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviews || 24})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">Talla: {product.size || 'M'}</span>
          <span className="text-xs text-gray-500">Color: {product.color || 'Negro'}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${Math.min((product.stock || 50) / 100 * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>Stock: {product.stock || 50} unidades</span>
          <span>{product.stock > 20 ? 'Disponible' : 'Poco stock'}</span>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Agregando...
            </>
          ) : (
            <>
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;