import React, { useState, useEffect } from "react";

export default function AgregarCategoria({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h3 className="text-lg font-semibold">➕ Agregar Categoría</h3>
          <button  onClick={onClose} className="text-gray-600 hover:text-red-500" > ✖ </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <input type="text" name="nombre" placeholder="Nombre de la categoría" value={formData.nombre} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400" > Cancelar </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500" >Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}