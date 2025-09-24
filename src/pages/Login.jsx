import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { usuarios } from '../data/usuario';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userFound = usuarios.find(
      (user) => user.username === username && user.password === password
    );

    if (userFound) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('nombreUsuario', userFound.nombre);
      navigate('/');
    } else {
      alert('Credenciales inválidas');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-xl shadow-md">
              <svg
                className="h-12 w-12 text-indigo-700"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                placeholder="Usuario"
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}