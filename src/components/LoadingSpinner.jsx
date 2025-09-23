import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className={`animate-spin rounded-full border-4 border-t-transparent border-indigo-500 ${sizeClasses[size]}`}></div>
      <p className="mt-4 text-indigo-700 font-medium animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;