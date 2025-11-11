// src/services/CompraService.js
import axios from "axios";

const API_URL = "http://localhost:8500/api/compras";

const CompraService = {
  getAllCompras: () => axios.get(API_URL),
  getCompraById: (id) => axios.get(`${API_URL}/${id}`),
  createCompra: (compraData) => axios.post(API_URL, compraData),
  updateCompra: (id, compraData) => axios.put(`${API_URL}/${id}`, compraData),
  deleteCompra: (id) => axios.delete(`${API_URL}/${id}`),
  getComprasByProveedor: (proveedorId) => axios.get(`${API_URL}/proveedor/${proveedorId}`),
  getComprasByEmpleado: (empleadoId) => axios.get(`${API_URL}/empleado/${empleadoId}`)
};

export default CompraService;