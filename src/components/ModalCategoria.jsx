import React, { useState } from "react";

export default function ModalCategoria({ onClose, recargarProductos }) {
  const [categoria, setCategoria] = useState("");

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!categoria.trim()) return alert("Ingrese una categoría válida.");

    try {
      const res = await fetch("http://localhost:8500/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria }),
      });

      if (res.ok) {
        alert("Categoría registrada correctamente ✅");
        setCategoria("");
        recargarProductos(); // para refrescar el modal de producto también
        onClose();
      } else {
        alert("Error al registrar la categoría ❌");
      }
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Crear Nueva Categoría
        </h2>

        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Camisas, Zapatillas..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}