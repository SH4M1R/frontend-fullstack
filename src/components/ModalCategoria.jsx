import { useState } from "react";

export default function ModalCategoria({ isOpen, onClose }) {
  const [categoria, setCategoria] = useState("");

  const guardar = async () => {
    await fetch("http://localhost:8500/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoria })
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-semibold mb-4">Nueva Categoría</h2>

        <input
          type="text"
          placeholder="Nombre de categoría"
          className="w-full border p-2 mb-4"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button onClick={guardar} className="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
