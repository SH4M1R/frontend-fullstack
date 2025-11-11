// src/pages/Configuracion.jsx (VERSIÓN MEJORADA)
import React, { useState, useEffect } from "react";
import UsuarioService from "../services/UsuarioService";
import { useTheme } from "../context/ThemeContext";
import { 
  UserCircleIcon, 
  CameraIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  EnvelopeIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
  CalendarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function Configuracion() {
  const { tema, cambiarTema, idioma, cambiarIdioma } = useTheme();
  const [usuario, setUsuario] = useState({
    idUsuario: 1,
    nombre: "",
    correo: "",
    direccion: "",
    telefono: "",
    contrasena: "",
    temaPreferido: "claro",
    idioma: "es"
  });
  
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [form, setForm] = useState({ ...usuario });
  const [passwordForm, setPasswordForm] = useState({
    passwordActual: "",
    nuevaPassword: "",
    confirmarPassword: ""
  });

  // Traducciones
  const traducciones = {
    es: {
      titulo: "Configuración de Perfil",
      descripcion: "Gestiona tu información personal, seguridad y preferencias de la cuenta",
      informacionPersonal: "Información Personal",
      editarPerfil: "Editar Perfil",
      cambiarContraseña: "Cambiar Contraseña",
      preferenciasTema: "Preferencias de Tema",
      preferenciasIdioma: "Preferencias de Idioma",
      modoClaro: "Modo Claro",
      modoOscuro: "Modo Oscuro",
      español: "Español",
      ingles: "Inglés",
      guardarCambios: "Guardar Cambios",
      cancelar: "Cancelar"
    },
    en: {
      titulo: "Profile Settings",
      descripcion: "Manage your personal information, security and account preferences",
      informacionPersonal: "Personal Information",
      editarPerfil: "Edit Profile",
      cambiarContraseña: "Change Password",
      preferenciasTema: "Theme Preferences",
      preferenciasIdioma: "Language Preferences",
      modoClaro: "Light Mode",
      modoOscuro: "Dark Mode",
      español: "Spanish",
      ingles: "English",
      guardarCambios: "Save Changes",
      cancelar: "Cancel"
    }
  };

  const t = traducciones[idioma];

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setCargando(true);
      const response = await UsuarioService.getPerfil();
      const userData = response.data;
      setUsuario(userData);
      setForm(userData);
      
      // Sincronizar con el contexto de tema
      if (userData.temaPreferido && userData.temaPreferido !== tema) {
        cambiarTema();
      }
      if (userData.idioma && userData.idioma !== idioma) {
        cambiarIdioma(userData.idioma);
      }
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      mostrarMensaje('error', 'Error al cargar los datos del perfil');
    } finally {
      setCargando(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        mostrarMensaje('error', 'La imagen debe ser menor a 5MB');
        return;
      }
      setAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const subirAvatar = async () => {
    if (!avatar) return;

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      
      await UsuarioService.uploadAvatar(formData);
      mostrarMensaje('success', 'Avatar actualizado correctamente');
    } catch (error) {
      console.error("Error al subir avatar:", error);
      mostrarMensaje('error', 'Error al subir el avatar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const usuarioActualizado = {
        ...form,
        temaPreferido: tema,
        idioma: idioma
      };
      
      const response = await UsuarioService.updatePerfil(usuarioActualizado);
      setUsuario(response.data);
      setEditando(false);
      mostrarMensaje('success', 'Perfil actualizado correctamente');
      
      if (avatar) {
        await subirAvatar();
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      mostrarMensaje('error', 'Error al actualizar el perfil');
    } finally {
      setCargando(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.nuevaPassword !== passwordForm.confirmarPassword) {
      mostrarMensaje('error', 'Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.nuevaPassword.length < 6) {
      mostrarMensaje('error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    try {
      await UsuarioService.changePassword({
        nuevaPassword: passwordForm.nuevaPassword
      });
      
      setPasswordForm({
        passwordActual: "",
        nuevaPassword: "",
        confirmarPassword: ""
      });
      setCambiandoPassword(false);
      mostrarMensaje('success', 'Contraseña cambiada correctamente');
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      mostrarMensaje('error', 'Error al cambiar la contraseña');
    } finally {
      setCargando(false);
    }
  };

  const handleTemaChange = () => {
    cambiarTema();
  };

  const handleIdiomaChange = (nuevoIdioma) => {
    cambiarIdioma(nuevoIdioma);
  };

  if (cargando && !editando && !cambiandoPassword) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        tema === 'oscuro' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      tema === 'oscuro' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            {t.titulo}
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            {t.descripcion}
          </p>
        </div>

        {/* Mensajes */}
        {mensaje.texto && (
          <div className={`mb-8 p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-up ${
            mensaje.tipo === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          } ${tema === 'oscuro' ? '!bg-gray-800 !border-gray-700' : ''}`}>
            <div className="flex items-center">
              {mensaje.tipo === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 mr-2" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              )}
              {mensaje.texto}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel Lateral */}
          <div className="lg:col-span-1 space-y-6">
            {/* Perfil Card */}
            <div className={`card p-6 transition-all duration-300 hover:shadow-lg ${
              tema === 'oscuro' ? 'bg-gray-800 border-gray-700' : ''
            }`}>
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg ${
                    tema === 'oscuro' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-400 to-purple-600'
                  }`}>
                    {previewAvatar ? (
                      <img 
                        src={previewAvatar} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : usuario.avatarUrl ? (
                      <img 
                        src={usuario.avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-20 h-20" />
                    )}
                  </div>
                  <label htmlFor="avatar-upload" className={`absolute bottom-2 right-2 rounded-full p-2 shadow-lg cursor-pointer transition-transform hover:scale-110 ${
                    tema === 'oscuro' ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <CameraIcon className="h-4 w-4 text-gray-700" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-semibold">{usuario.nombre}</h2>
                <p className="text-gray-600">{usuario.correo}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setEditando(!editando)}
                  className={`w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    editando 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : tema === 'oscuro' 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  {editando ? t.cancelar : t.editarPerfil}
                </button>

                <button
                  onClick={() => setCambiandoPassword(!cambiandoPassword)}
                  className={`w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    cambiandoPassword 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : tema === 'oscuro' 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ShieldCheckIcon className="h-5 w-5 mr-3" />
                  {cambiandoPassword ? t.cancelar : t.cambiarContraseña}
                </button>
              </div>
            </div>

            {/* Configuración Rápida */}
            <div className={`card p-6 transition-all duration-300 ${
              tema === 'oscuro' ? 'bg-gray-800 border-gray-700' : ''
            }`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Cog6ToothIcon className="h-5 w-5 mr-2 text-indigo-500" />
                Configuración Rápida
              </h3>
              
              {/* Selector de Tema */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {t.preferenciasTema}
                </label>
                <button
                  onClick={handleTemaChange}
                  className={`w-full py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
                    tema === 'oscuro' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center">
                    {tema === 'oscuro' ? (
                      <>
                        <MoonIcon className="h-4 w-4 mr-2" />
                        {t.modoOscuro}
                      </>
                    ) : (
                      <>
                        <SunIcon className="h-4 w-4 mr-2" />
                        {t.modoClaro}
                      </>
                    )}
                  </span>
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                    tema === 'oscuro' ? 'bg-indigo-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"></div>
                  </div>
                </button>
              </div>

              {/* Selector de Idioma */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.preferenciasIdioma}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleIdiomaChange('es')}
                    className={`py-2 px-3 rounded-lg transition-all duration-300 ${
                      idioma === 'es' 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : tema === 'oscuro' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {t.español}
                  </button>
                  <button
                    onClick={() => handleIdiomaChange('en')}
                    className={`py-2 px-3 rounded-lg transition-all duration-300 ${
                      idioma === 'en' 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : tema === 'oscuro' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {t.ingles}
                  </button>
                </div>
              </div>
            </div>
          </div>


   
          {/* Contenido Principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* Información del Perfil */}
            {!editando && !cambiandoPassword && (
              <div className={`card p-8 transform transition-all duration-500 animate-slide-up ${
                tema === 'oscuro' ? 'bg-gray-800 border-gray-700' : ''
              }`}>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <UserCircleIcon className="h-6 w-6 mr-3 text-indigo-600" />
                  {t.informacionPersonal}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`rounded-lg p-4 transition-colors ${
                    tema === 'oscuro' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-center mb-2">
                      <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="font-semibold">Nombre</span>
                    </div>
                    <p className="text-lg">{usuario.nombre || "No especificado"}</p>
                  </div>

                  <div className={`rounded-lg p-4 transition-colors ${
                    tema === 'oscuro' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-center mb-2">
                      <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="font-semibold">Email</span>
                    </div>
                    <p className="text-lg">{usuario.correo || "No especificado"}</p>
                  </div>

                  <div className={`rounded-lg p-4 transition-colors ${
                    tema === 'oscuro' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-center mb-2">
                      <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="font-semibold">Teléfono</span>
                    </div>
                    <p className="text-lg">{usuario.telefono || "No especificado"}</p>
                  </div>

                  <div className={`rounded-lg p-4 transition-colors ${
                    tema === 'oscuro' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-center mb-2">
                      <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="font-semibold">Dirección</span>
                    </div>
                    <p className="text-lg">{usuario.direccion || "No especificada"}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Formulario de Edición */}
            {editando && (
              <div className="card p-8 transform transition-all duration-500 animate-slide-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Editar Perfil</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label flex items-center">
                        <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre || ''}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label flex items-center">
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="correo"
                        value={form.correo || ''}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label flex items-center">
                        <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={form.telefono || ''}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="form-label flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={form.direccion || ''}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditando(false);
                        setForm(usuario);
                        setAvatar(null);
                        setPreviewAvatar(null);
                      }}
                      className="btn-secondary flex-1"
                      disabled={cargando}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 flex items-center justify-center"
                      disabled={cargando}
                    >
                      {cargando ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Cambio de Contraseña */}
            {cambiandoPassword && (
              <div className="card p-8 transform transition-all duration-500 animate-slide-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-3 text-indigo-600" />
                  Cambiar Contraseña
                </h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="form-label">Contraseña Actual</label>
                    <input
                      type="password"
                      name="passwordActual"
                      value={passwordForm.passwordActual}
                      onChange={handlePasswordChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Nueva Contraseña</label>
                    <input
                      type="password"
                      name="nuevaPassword"
                      value={passwordForm.nuevaPassword}
                      onChange={handlePasswordChange}
                      className="input-field"
                      required
                      minLength="6"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      La contraseña debe tener al menos 6 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="form-label">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      name="confirmarPassword"
                      value={passwordForm.confirmarPassword}
                      onChange={handlePasswordChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCambiandoPassword(false);
                        setPasswordForm({
                          passwordActual: "",
                          nuevaPassword: "",
                          confirmarPassword: ""
                        });
                      }}
                      className="btn-secondary flex-1"
                      disabled={cargando}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 flex items-center justify-center"
                      disabled={cargando}
                    >
                      {cargando ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Cambiando...
                        </>
                      ) : (
                        'Cambiar Contraseña'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Estadísticas o Información Adicional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Miembro desde</h4>
                <p className="text-gray-600">Ene 2024</p>
              </div>

              <div className="card p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Estado</h4>
                <p className="text-green-600 font-medium">Activo</p>
              </div>

              <div className="card p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Verificación</h4>
                <p className="text-purple-600 font-medium">Verificado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}