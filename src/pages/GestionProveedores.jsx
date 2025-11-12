import React, { useState, useEffect } from "react";
import ModalProveedor from "../components/ModalProveedor";
import { useAuth } from "../context/AuthContext";

export default function GestionProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proveedorToEdit, setProveedorToEdit] = useState(null);
  const { authFetch } = useAuth();

  // Cargar proveedores al montar el componente
  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const res = await authFetch("http://localhost:8500/api/proveedores");
      if (!res.ok) throw new Error("Error al obtener proveedores");
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (proveedor = null) => {
    setProveedorToEdit(proveedor);
    setShowModal(true);
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    setProveedorToEdit(null);
    fetchProveedores();
  };

  const handleDelete = async (idProveedor) => {
    if (!window.confirm(`¿Seguro de eliminar al proveedor con ID ${idProveedor}?`)) return;

    try {
      const res = await authFetch(`http://localhost:8500/api/proveedores/${idProveedor}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar proveedor");
      setProveedores(proveedores.filter((p) => p.idProveedor !== idProveedor));
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      alert("Fallo al eliminar el proveedor.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Gestión de Proveedores</h3>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <i className="bi bi-person-plus-fill text-lg"></i>
          Agregar Proveedor
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading ? (
          <p className="text-center py-4 text-gray-600">Cargando proveedores...</p>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Dirección</th>
                <th className="px-4 py-3">RUC</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.length > 0 ? (
                proveedores.map((prov) => (
                  <tr key={prov.idProveedor} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{prov.idProveedor}</td>
                    <td className="px-4 py-3">{prov.nombre}</td>
                    <td className="px-4 py-3">{prov.contacto}</td>
                    <td className="px-4 py-3">{prov.telefono}</td>
                    <td className="px-4 py-3">{prov.direccion}</td>
                    <td className="px-4 py-3">{prov.ruc}</td>
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                      {/* Botón Editar */}
                      <button
                        onClick={() => handleOpenModal(prov)}
                        className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md shadow transition"
                        title="Editar proveedor"
                      >
                        Editar
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        onClick={() => handleDelete(prov.idProveedor)}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow transition"
                        title="Eliminar proveedor"
                      >
                        Eliminar
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No hay proveedores registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ModalProveedor
          onClose={() => setShowModal(false)}
          proveedor={proveedorToEdit}
          refresh={fetchProveedores}
        />
      )}
    </div>
  );
}
