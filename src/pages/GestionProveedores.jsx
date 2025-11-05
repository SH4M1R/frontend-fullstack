import { useEffect, useState } from "react";
import ModalProveedor from "../components/ModalProveedor";

export default function GestionProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const fetchProveedores = async () => {
    const res = await fetch("http://localhost:8500/api/proveedores");
    const data = await res.json();
    setProveedores(data);
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleAdd = () => {
    setSelectedProveedor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (proveedor) => {
    setSelectedProveedor(proveedor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8500/api/proveedores/${id}`, {
      method: "DELETE",
    });
    fetchProveedores();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Proveedores</h1>
        <button onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        > Nuevo Proveedor
        </button>
      </div>

      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Contacto</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Dirección</th>
            <th className="p-2 border">RUC</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((prov) => (
            <tr key={prov.idProveedor}>
              <td className="p-2 border">{prov.idProveedor}</td>
              <td className="p-2 border">{prov.nombre}</td>
              <td className="p-2 border">{prov.contacto}</td>
              <td className="p-2 border">{prov.telefono}</td>
              <td className="p-2 border">{prov.direccion}</td>
              <td className="p-2 border">{prov.ruc}</td>
              <td className="p-2 border flex gap-2">
                <button onClick={() => handleEdit(prov)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                > Editar </button>
                <button onClick={() => handleDelete(prov.idProveedor)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                > Eliminar </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <ModalProveedor onClose={() => setIsModalOpen(false)} proveedor={selectedProveedor} refresh={fetchProveedores} />
      )}
    </div>
  );
}
