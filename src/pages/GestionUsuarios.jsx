import React, { useState, useEffect } from "react";

function ModalUsuario({ onClose, onSave, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      tipo: "Cliente",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.email) {
      alert("Nombre, apellido y email son obligatorios");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          {initialData ? "Editar" : "Agregar"} {form.tipo}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="Cliente">Cliente</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [editUsuarioIndex, setEditUsuarioIndex] = useState(null);

  useEffect(() => {
    const storedUsuarios = localStorage.getItem("usuarios");
    if (storedUsuarios) setUsuarios(JSON.parse(storedUsuarios));
  }, []);

  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  const guardarUsuario = (usuario) => {
    if (editUsuarioIndex !== null) {
      const actualizados = [...usuarios];
      actualizados[editUsuarioIndex] = {
        ...usuario,
        id: usuarios[editUsuarioIndex].id,
      };
      setUsuarios(actualizados);
      setEditUsuarioIndex(null);
    } else {
      setUsuarios([
        ...usuarios,
        { id: usuarios.length + 1, ...usuario },
      ]);
    }
    setModalUsuarioOpen(false);
  };

  const editarUsuario = (index) => {
    setEditUsuarioIndex(index);
    setModalUsuarioOpen(true);
  };

  const eliminarUsuario = (index) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      const actualizados = usuarios.filter((_, i) => i !== index);
      setUsuarios(actualizados);
    }
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold"> Gestión de Usuarios y Clientes</h2>
        <button
          onClick={() => {
            setEditUsuarioIndex(null);
            setModalUsuarioOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        > + Agregar </button>
      </div>

      {/* Tabla de usuarios/clientes */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Tipo</th>
              <th className="border px-2 py-2">Nombre</th>
              <th className="border px-2 py-2">Apellido</th>
              <th className="border px-2 py-2">Email</th>
              <th className="border px-2 py-2">Teléfono</th>
              <th className="border px-2 py-2">Dirección</th>
              <th className="border px-2 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u, index) => (
                <tr key={u.id} className="text-center hover:bg-gray-50">
                  <td className="border px-2 py-2">{u.id}</td>
                  <td className="border px-2 py-2">{u.tipo}</td>
                  <td className="border px-2 py-2">{u.nombre}</td>
                  <td className="border px-2 py-2">{u.apellido}</td>
                  <td className="border px-2 py-2">{u.email}</td>
                  <td className="border px-2 py-2">{u.telefono || "—"}</td>
                  <td className="border px-2 py-2">{u.direccion || "—"}</td>
                  <td className="border px-2 py-2 space-x-2">
                    <button
                      onClick={() => editarUsuario(index)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400"
                    > Editar </button>
                    <button
                      onClick={() => eliminarUsuario(index)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                    > Eliminar </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {modalUsuarioOpen && (
        <ModalUsuario
          onClose={() => setModalUsuarioOpen(false)}
          onSave={guardarUsuario}
          initialData={editUsuarioIndex !== null ? usuarios[editUsuarioIndex] : null}
        />
      )}
    </div>
  );
}