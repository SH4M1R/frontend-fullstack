// src/services/DashboardService.js
import axios from "axios";

const API_URL = "http://localhost:8500/api/dashboard";

// Configuración global de axios para manejar errores
axios.interceptors.request.use(
  config => {
    console.log(` Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  error => {
    console.error(' Request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    console.log(' Response received:', response.status);
    return response;
  },
  error => {
    console.error(' Response error:', error);
    if (error.code === 'NETWORK_ERROR') {
      console.error(' Network error - Check if backend is running on port 8500');
    }
    return Promise.reject(error);
  }
);

const DashboardService = {
  // Obtener estadísticas principales
  getEstadisticas: () => axios.get(`${API_URL}/estadisticas`),
  
  // Obtener estadísticas de compras
  getEstadisticasCompras: () => axios.get(`${API_URL}/compras/estadisticas`),
  
  // Obtener actividad reciente
  getActividadReciente: () => axios.get(`${API_URL}/actividad-reciente`),
  
  // Obtener ventas de los últimos meses
  getVentasUltimosMeses: () => axios.get(`${API_URL}/ventas-ultimos-meses`),
  
  // Obtener productos populares
  getProductosPopulares: () => axios.get(`${API_URL}/productos-populares`),
  
  // Obtener compras recientes
  getComprasRecientes: () => axios.get(`${API_URL}/compras/recientes`)
};

export default DashboardService;