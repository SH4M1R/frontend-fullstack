import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GlobalStateProvider } from './store/globalState';
import NotificationContainer from './components/NotificationContainer';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy loading para las páginas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductList = lazy(() => import('./pages/ProductList'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const SalesReport = lazy(() => import('./pages/SalesReport'));
const Login = lazy(() => import('./pages/Login'));

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  // En una implementación real, verificarías el estado de autenticación
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <GlobalStateProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/product-list" 
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-product" 
                element={
                  <ProtectedRoute>
                    <AddProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales-report" 
                element={
                  <ProtectedRoute>
                    <SalesReport />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <NotificationContainer />
        </div>
      </Router>
    </GlobalStateProvider>
  );
};

export default App;