import React, { useState, useEffect } from "react";

export default function Configuracion() {
  // Simulación de usuario actual (en un caso real, vendría de contexto o API)
  const [usuario, setUsuario] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@email.com",
    telefono: "",
    direccion: "",
    password: "",
  });
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(usuario);

  useEffect(() => {
    // Cargar datos guardados (simulación con localStorage)
    const guardado = localStorage.getItem("perfilUsuario");
    if (guardado) {
      setUsuario(JSON.parse(guardado));
      setForm(JSON.parse(guardado));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsuario(form);
    localStorage.setItem("perfilUsuario", JSON.stringify(form));
    setEditando(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Configuración de Perfil</h2>
      {!editando ? (
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Nombre:</span> {usuario.nombre}
          </div>
          <div>
            <span className="font-semibold">Apellido:</span> {usuario.apellido}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {usuario.email}
          </div>
          <div>
            <span className="font-semibold">Teléfono:</span> {usuario.telefono || "—"}
          </div>
          <div>
            <span className="font-semibold">Dirección:</span> {usuario.direccion || "—"}
          </div>
          <button
            onClick={() => setEditando(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {/* Cambiar contraseña (opcional) */}
          <div>
            <label className="block text-sm font-medium">Nueva contraseña</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              type="button"
              onClick={() => { setEditando(false); setForm(usuario); }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
