import React, { useState, useEffect } from "react";
import ModalProveedor from "../components/ModalProveedor";
import { useAuth } from "../context/AuthContext";
import { PencilIcon, TrashIcon } from "lucide-react";

export default function GestionProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proveedorToEdit, setProveedorToEdit] = useState(null);
  const { authFetch } = useAuth();

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
      console.error("Error al cargar proveedores:", error);
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
    if (!window.confirm(`¿Seguro de eliminar el proveedor con ID ${idProveedor}?`)) return;

    try {
      const res = await authFetch(`http://localhost:8500/api/proveedores/${idProveedor}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar proveedor");
      setProveedores(proveedores.filter((p) => p.idProveedor !== idProveedor));
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      alert("No se pudo eliminar el proveedor.");
    }
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Gestión de Proveedores</h3>
        <button onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition">
          <i className="bi bi-plus-circle-fill text-lg"></i>
          Agregar Proveedor</button>
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
                proveedores.map((p) => (
                  <tr key={p.idProveedor} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{p.idProveedor}</td>
                    <td className="px-4 py-3">{p.nombre}</td>
                    <td className="px-4 py-3">{p.contacto}</td>
                    <td className="px-4 py-3">{p.telefono}</td>
                    <td className="px-4 py-3">{p.direccion}</td>
                    <td className="px-4 py-3">{p.ruc}</td>
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(p)}><PencilIcon className="h-5 w-5 text-indigo-600" /></button>
                      <button onClick={() => handleDelete(p.idProveedor)}><TrashIcon className="h-5 w-5 text-red-600" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">No hay proveedores registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ModalProveedor show={showModal} onClose={() => setShowModal(false)}
          onSave={handleSaveSuccess} proveedorData={proveedorToEdit}/>
      )}
    </div>
  );
}