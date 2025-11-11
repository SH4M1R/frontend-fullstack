import axios from "axios";

const API_URL = "http://localhost:8500/api/proveedores";

const ProveedorService = {
  getAllProveedores: () => axios.get(API_URL),
  getProveedorById: (id) => axios.get(`${API_URL}/${id}`),
  createProveedor: (proveedorData) => axios.post(API_URL, proveedorData),
  updateProveedor: (id, proveedorData) => axios.put(`${API_URL}/${id}`, proveedorData),
  deleteProveedor: (id) => axios.delete(`${API_URL}/${id}`)
};

export default ProveedorService;