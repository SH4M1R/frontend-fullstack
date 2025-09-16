import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const App = () => {
  return (
    <GlobalStateProvider>
      <Router>
        <div className="app">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/sales" element={<SalesReport />} />
            </Routes>
          </Suspense>
          <NotificationContainer />
        </div>
      </Router>
    </GlobalStateProvider>
  );
};

export default App;