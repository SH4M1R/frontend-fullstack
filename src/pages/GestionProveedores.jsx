import React, { useState, useEffect } from "react";
import BotonAgregarProveedor from "../components/AddProveedor";

export default function GestionProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [modalProveedorOpen, setModalProveedorOpen] = useState(false);
  const [editProveedorIndex, setEditProveedorIndex] = useState(null);

  useEffect(() => {
    const storedProveedores = localStorage.getItem("proveedores");
    if (storedProveedores) setProveedores(JSON.parse(storedProveedores));
  }, []);

  useEffect(() => {
    localStorage.setItem("proveedores", JSON.stringify(proveedores));
  }, [proveedores]);

  const guardarProveedor = (proveedor) => {
    if (editProveedorIndex !== null) {
      const actualizados = [...proveedores];
      actualizados[editProveedorIndex] = {
        ...proveedor,
        id: proveedores[editProveedorIndex].id,
      };
      setProveedores(actualizados);
      setEditProveedorIndex(null);
    } else {
      setProveedores([
        ...proveedores,
        { id: proveedores.length + 1, ...proveedor },
      ]);
    }
    setModalProveedorOpen(false);
  };

  const editarProveedor = (index) => {
    setEditProveedorIndex(index);
    setModalProveedorOpen(true);
  };

  const eliminarProveedor = (index) => {
    if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
      const actualizados = proveedores.filter((_, i) => i !== index);
      setProveedores(actualizados);
    }
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🏢 Gestión de Proveedores</h2>
        <BotonAgregarProveedor
          onProveedorAgregado={(nuevoProveedor) => {
            setProveedores([
              ...proveedores,
              { id: proveedores.length + 1, ...nuevoProveedor },
            ]);
          }}
        />
      </div>

      {/* Tabla de proveedores */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Nombre</th>
              <th className="border px-2 py-2">Empresa</th>
              <th className="border px-2 py-2">Email</th>
              <th className="border px-2 py-2">Teléfono</th>
              <th className="border px-2 py-2">Dirección</th>
              <th className="border px-2 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map((p, index) => (
                <tr key={p.id} className="text-center hover:bg-gray-50">
                  <td className="border px-2 py-2">{p.id}</td>
                  <td className="border px-2 py-2">{p.nombre}</td>
                  <td className="border px-2 py-2">{p.empresa}</td>
                  <td className="border px-2 py-2">{p.email}</td>
                  <td className="border px-2 py-2">{p.telefono || "—"}</td>
                  <td className="border px-2 py-2">{p.direccion || "—"}</td>
                  <td className="border px-2 py-2 space-x-2">
                    <button
                      onClick={() => editarProveedor(index)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400"
                    > ✏️ </button>
                    <button
                      onClick={() => eliminarProveedor(index)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                    > 🗑️ </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No hay proveedores registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales de edición */}
      {modalProveedorOpen && (
        <ModalProveedor
          onClose={() => setModalProveedorOpen(false)}
          onSave={guardarProveedor}
          initialData={editProveedorIndex !== null ? proveedores[editProveedorIndex] : null}
        />
      )}
    </div>
  );
}