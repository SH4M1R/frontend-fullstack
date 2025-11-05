import { useState, useEffect } from "react";

export default function ModalProveedor({ onClose, proveedor, refresh }) {
  const [form, setForm] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    direccion: "",
    ruc: "",
  });

  useEffect(() => {
    if (proveedor) setForm(proveedor);
  }, [proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = proveedor ? "PUT" : "POST";
    const url = proveedor
      ? `http://localhost:8500/api/proveedores/${proveedor.idProveedor}`
      : "http://localhost:8500/api/proveedores";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg animate-fadeIn">
        <h2 className="text-xl font-bold mb-4">
          {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="border p-2 rounded"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="contacto"
            placeholder="Contacto"
            className="border p-2 rounded"
            value={form.contacto}
            onChange={handleChange}
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            className="border p-2 rounded"
            value={form.telefono}
            onChange={handleChange}
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            className="border p-2 rounded"
            value={form.direccion}
            onChange={handleChange}
          />

          <input
            type="number"
            name="ruc"
            placeholder="RUC"
            className="border p-2 rounded"
            value={form.ruc}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}