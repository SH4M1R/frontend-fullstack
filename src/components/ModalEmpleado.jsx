import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ModalEmpleado({ show, onClose, onSave, empleadoData }) {
  const { authFetch } = useAuth(); 
  if (!show) return null;

  const isEditing = !!empleadoData;
  const initialData = { user: "", username: "", contrasena: "", rol: { idRol: "" } };

  const [data, setData] = useState(initialData);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:8500/api";

  useEffect(() => {
    if (show) {
      fetchRoles();
      if (isEditing && empleadoData) {
        setData({
          user: empleadoData.user,
          username: empleadoData.username,
          contrasena: "",
          rol: { idRol: empleadoData.rol?.idRol || "" },
        });
      } else {
        setData(initialData);
      }
      setError(null);
    }
  }, [show, isEditing, empleadoData]);

  const fetchRoles = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/roles`);
      if (!res.ok) throw new Error("Error al cargar roles");
      const list = await res.json();
      setRoles(list);
      if (!isEditing && list.length > 0) {
        setData((prev) => ({ ...prev, rol: { idRol: list[0].idRol } }));
      }
    } catch {
      setError("No se pudieron cargar los roles.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rolId") {
      setData({ ...data, rol: { idRol: parseInt(value) } });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!data.rol.idRol) {
      setError("Seleccione un rol.");
      setLoading(false);
      return;
    }

    const url = isEditing
      ? `${BASE_URL}/empleados/${empleadoData.idEmpleado}`
      : `${BASE_URL}/empleados`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Error al ${isEditing ? "actualizar" : "crear"} empleado`);
      onSave();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Encabezado */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {isEditing ? "Editar Empleado" : "Nuevo Empleado"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-3 text-center">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="user"
              value={data.user}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario (Username)
            </label>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="contrasena"
              value={data.contrasena}
              onChange={handleChange}
              required={!isEditing}
              placeholder={isEditing ? "Dejar en blanco para mantener la actual" : ""}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              name="rolId"
              value={data.rol.idRol || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.rol}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !data.rol.idRol}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Guardar"}
            </button>
          </div>
        </form>

        {/* Botón de cierre (esquina superior derecha) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}