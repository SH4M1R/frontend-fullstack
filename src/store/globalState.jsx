import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { productAPI, authAPI } from '../services/api';

// Crear el contexto
const GlobalStateContext = createContext();

// Estado inicial
const initialState = {
  user: null,
  products: [],
  cart: [],
  sales: [],
  notifications: [],
  loading: false,
  error: null
};

// Tipos de acciones
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_CART: 'SET_CART',
  ADD_TO_CART: 'ADD_TO_CART',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  SET_SALES: 'SET_SALES',
  ADD_SALE: 'ADD_SALE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
};

// Reducer
const globalReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    
    case actionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };
    
    case actionTypes.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    
    case actionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    
    case actionTypes.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case actionTypes.SET_CART:
      return { ...state, cart: action.payload };
    
    case actionTypes.ADD_TO_CART: {
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return { ...state, cart: [...state.cart, action.payload] };
    }
    
    case actionTypes.UPDATE_CART_ITEM:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    
    case actionTypes.CLEAR_CART:
      return { ...state, cart: [] };
    
    case actionTypes.SET_SALES:
      return { ...state, sales: action.payload };
    
    case actionTypes.ADD_SALE:
      return { ...state, sales: [...state.sales, action.payload] };
    
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }]
      };
    
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
    
    default:
      return state;
  }
};

// Hook personalizado para usar el estado global
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState debe ser usado dentro de un GlobalStateProvider');
  }
  return context;
};

// Proveedor del estado global
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  // Memoizar las acciones para evitar recrearlas en cada render
  const actions = useMemo(() => ({
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, payload: user }),
    setProducts: (products) => dispatch({ type: actionTypes.SET_PRODUCTS, payload: products }),
    addProduct: (product) => dispatch({ type: actionTypes.ADD_PRODUCT, payload: product }),
    updateProduct: (product) => dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: product }),
    deleteProduct: (productId) => dispatch({ type: actionTypes.DELETE_PRODUCT, payload: productId }),
    setCart: (cart) => dispatch({ type: actionTypes.SET_CART, payload: cart }),
    addToCart: (product, quantity = 1) => 
      dispatch({ type: actionTypes.ADD_TO_CART, payload: { product, quantity } }),
    updateCartItem: (productId, quantity) => 
      dispatch({ type: actionTypes.UPDATE_CART_ITEM, payload: { productId, quantity } }),
    removeFromCart: (productId) => 
      dispatch({ type: actionTypes.REMOVE_FROM_CART, payload: productId }),
    clearCart: () => dispatch({ type: actionTypes.CLEAR_CART }),
    setSales: (sales) => dispatch({ type: actionTypes.SET_SALES, payload: sales }),
    addSale: (sale) => dispatch({ type: actionTypes.ADD_SALE, payload: sale }),
    addNotification: (notification) => 
      dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification }),
    removeNotification: (notificationId) => 
      dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: notificationId }),
  }), [dispatch]);

  // Efectos para cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        actions.setLoading(true);
        
        // Verificar autenticación
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const userResponse = await authAPI.verify();
            actions.setUser(userResponse.data);
          } catch (authError) {
            localStorage.removeItem('authToken');
            console.error('Error verifying auth:', authError);
          }
        }
        
        // Cargar productos
        const productsResponse = await productAPI.getAll();
        actions.setProducts(productsResponse.data);
        
        actions.setLoading(false);
      } catch (error) {
        actions.setError(error.message);
        actions.setLoading(false);
      }
    };
    
    loadInitialData();
  }, [actions]);

  // Valor del contexto
  const value = useMemo(() => ({
    ...state,
    ...actions
  }), [state, actions]);

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};