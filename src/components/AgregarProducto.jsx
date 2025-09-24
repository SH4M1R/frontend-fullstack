import React, { useState, useEffect } from "react";

export default function AgregarProducto({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    Producto: "",
    PrecioCompra: "",
    PrecioVenta: "",
    Stock: "",
    Talla: "",
    Color: "",
    Foto: "",
    Genero: true,
    Categoria: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "Genero") {
      setFormData({
        ...formData,
        [name]: value === "true",
      });
    } else if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, Foto: reader.result });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h3 className="text-lg font-semibold">➕ Agregar Producto</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500">✖</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <input type="text" name="Producto" placeholder="Nombre del producto" value={formData.Producto} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required/>
          <div className="grid grid-cols-2 gap-3">
                <input type="number" name="PrecioCompra" placeholder="Precio Compra" value={formData.PrecioCompra} onChange={handleChange} className="border rounded-md px-3 py-2" required />
                <input type="number" name="PrecioVenta" placeholder="Precio Venta" value={formData.PrecioVenta} onChange={handleChange} className="border rounded-md px-3 py-2"required />
          </div>
                <input type="number"  name="Stock" placeholder="Stock" value={formData.Stock} onChange={handleChange} className="w-full border rounded-md px-3 py-2"required />
          <div className="grid grid-cols-2 gap-3">
                <input type="text" name="Talla" placeholder="Talla" value={formData.Talla} onChange={handleChange} className="border rounded-md px-3 py-2" />
                <input type="text" name="Color" placeholder="Color" value={formData.Color} onChange={handleChange} className="border rounded-md px-3 py-2" />
          </div>
                <label className="block text-sm font-medium mb-1">Foto:</label>
                <input type="file" accept="image/*" onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            {formData.Foto && ( <img src={formData.Foto} alt="preview" className="h-20 w-20 object-cover mt-2 rounded" /> )}
          <div>
            <label className="text-sm font-medium">Género:</label>
            <select name="Genero" value={formData.Genero} onChange={handleChange} className="w-full border rounded-md px-3 py-2"
            >
              <option value={true}>Masculino</option>
              <option value={false}>Femenino</option>
            </select>
          </div>
                <input type="text" name="Categoria" placeholder="Categoría" value={formData.Categoria} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"> Cancelar</button>
            <button ype="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}