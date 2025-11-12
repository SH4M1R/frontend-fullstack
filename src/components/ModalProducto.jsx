import React, { useEffect, useState } from "react";

export default function ModalProducto({ producto, onClose }) {
  const [form, setForm] = useState({
    producto: "",
    precioCompra: "",
    precioVenta: "",
    descripcion: "",
    estado: true,
    stock: "",
    talla: "",
    color: "",
    genero: true,
    categoria: "",
    imagen: null,
  });

  const [categorias, setCategorias] = useState([]);
  const [preview, setPreview] = useState(null);

  const cargarCategorias = async () => {
    const res = await fetch("http://localhost:8500/api/categorias");
    const data = await res.json();
    setCategorias(data);
  };

  useEffect(() => {
    cargarCategorias();
    if (producto) {
      setForm({
        producto: producto.producto || "",
        precioCompra: producto.precioCompra || "",
        precioVenta: producto.precioVenta || "",
        descripcion: producto.descripcion || "",
        estado: producto.estado ?? true,
        stock: producto.stock || "",
        talla: producto.talla || "",
        color: producto.color || "",
        genero: producto.genero ?? true,
        categoria: producto.categoria?.idCategoria || "",
        imagen: null,
      });
      if (producto.imagen) {
        setPreview(`http://localhost:8500/upload/${producto.imagen}`);
      }
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (files) {
      const file = files[0];
      setForm({ ...form, imagen: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "producto",
      new Blob(
        [
          JSON.stringify({
            producto: form.producto,
            precioCompra: form.precioCompra,
            precioVenta: form.precioVenta,
            descripcion: form.descripcion,
            estado: form.estado,
            stock: form.stock,
            talla: form.talla,
            color: form.color,
            genero: form.genero,
            categoria: { idCategoria: form.categoria },
          }),
        ],
        { type: "application/json" }
      )
    );
    if (form.imagen) formData.append("imagen", form.imagen);

    const method = producto ? "PUT" : "POST";
    const url = producto
      ? `http://localhost:8500/api/productos/${producto.idProducto}`
      : `http://localhost:8500/api/productos`;

    await fetch(url, { method, body: formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/5 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="producto"
            placeholder="Nombre del producto"
            value={form.producto}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="precioCompra"
            type="number"
            placeholder="Precio de compra"
            value={form.precioCompra}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="precioVenta"
            type="number"
            placeholder="Precio de venta"
            value={form.precioVenta}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="talla"
            placeholder="Talla"
            value={form.talla}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          ></textarea>

          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
            required
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((c) => (
              <option key={c.idCategoria} value={c.idCategoria}>
                {c.categoria}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2 col-span-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="estado" checked={form.estado} onChange={handleChange} />
              <span>Activo</span>
            </label>
          </div>
          
          <label className="block font-semibold">Género:
            <select className="border p-2"
            value={form.genero ? "true" : "false"}
            onChange={(e) => setForm({ ...form, genero: e.target.value === "true" })}>
            <option value="true">Masculino</option>
            <option value="false">Femenino</option>
          </select>
          </label>

          <div className="mt-3">
          <input type="file" onChange={(e) => { setImagen(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} />
        </div>

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {producto ? "Guardar Cambios" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
