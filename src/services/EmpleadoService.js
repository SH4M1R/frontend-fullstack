import axios from "axios";

const API_URL = "http://localhost:8500/api/empleados";

const EmpleadoService = {
  getAllEmpleados: () => axios.get(API_URL),
  getEmpleadoById: (id) => axios.get(`${API_URL}/${id}`),
  createEmpleado: (empleadoData) => axios.post(API_URL, empleadoData),
  updateEmpleado: (id, empleadoData) => axios.put(`${API_URL}/${id}`, empleadoData),
  deleteEmpleado: (id) => axios.delete(`${API_URL}/${id}`)
};

export default EmpleadoService;