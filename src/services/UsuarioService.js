import axios from "axios";

const API_URL = "http://localhost:8500/api/usuarios";

const UsuarioService = {
  // Obtener perfil del usuario actual
  getPerfil: () => axios.get(`${API_URL}/perfil`),
  
  // Actualizar perfil del usuario
  updatePerfil: (usuarioData) => axios.put(`${API_URL}/perfil`, usuarioData),
  
  // Cambiar contraseña
  changePassword: (passwordData) => axios.put(`${API_URL}/cambiar-password`, passwordData),
  
  // Subir avatar
  uploadAvatar: (formData) => axios.post(`${API_URL}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

export default UsuarioService;