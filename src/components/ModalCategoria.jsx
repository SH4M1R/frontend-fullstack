import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ModalCategoria({ isOpen, onClose }) {
  const { authFetch } = useAuth();
  const BASE_URL = "http://localhost:8500/api";

  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const guardar = async () => {
    if (!categoria.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(`${BASE_URL}/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria }),
      });

      if (!res.ok) throw new Error("Error al guardar la categoría");

      onClose();
      setCategoria("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
