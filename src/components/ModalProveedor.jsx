import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ModalProveedor({ show, onClose, onSave, proveedorData }) {
  const { authFetch } = useAuth();
  if (!show) return null;

  const isEditing = !!proveedorData;
  const initialData = {
    nombre: "",
    contacto: "",
    telefono: "",
    direccion: "",
    ruc: "",
  };

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:8500/api/proveedores";

  useEffect(() => {
    if (isEditing && proveedorData) {
      setData(proveedorData);
    } else {
      setData(initialData);
    }
    setError(null);
  }, [show, isEditing, proveedorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isEditing ? `${BASE_URL}/${proveedorData.idProveedor}` : BASE_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al guardar proveedor");
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={data.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
            <input
              type="text"
              name="contacto"
              value={data.contacto}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={data.telefono}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={data.direccion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
            <input
              type="number"
              name="ruc"
              value={data.ruc}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Guardar"}
            </button>
          </div>
        </form>

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
