import { useEffect, useState } from "react";

export default function ModalProducto({ isOpen, onClose, productoEditar }) {
  const [categorias, setCategorias] = useState([]);
  const [preview, setPreview] = useState(null);

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
    categoria: null
  });

  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8500/api/categorias")
      .then(res => res.json())
      .then(setCategorias);

    if (productoEditar) {
      setForm({
        producto: productoEditar.producto,
        precioCompra: productoEditar.precioCompra,
        precioVenta: productoEditar.precioVenta,
        descripcion: productoEditar.descripcion,
        estado: productoEditar.estado,
        stock: productoEditar.stock,
        talla: productoEditar.talla,
        color: productoEditar.color,
        genero: productoEditar.genero,
        categoria: { idCategoria: productoEditar.categoria?.idCategoria }
      });
      setPreview(`http://localhost:8500${productoEditar.imagen}`);
    }
  }, [productoEditar]);

  const guardar = async () => {
    const formData = new FormData();
    formData.append("producto", new Blob([JSON.stringify(form)], { type: "application/json" }));
    if (imagen) formData.append("imagen", imagen);

    await fetch(`http://localhost:8500/api/productos${productoEditar ? `/${productoEditar.idProducto}` : ""}`, {
      method: productoEditar ? "PUT" : "POST",
      body: formData
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-xl font-semibold mb-4">
          {productoEditar ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2" placeholder="Nombre"
            value={form.producto}
            onChange={(e) => setForm({ ...form, producto: e.target.value })} />

          <input className="border p-2" type="number" placeholder="Precio Compra"
            value={form.precioCompra}
            onChange={(e) => setForm({ ...form, precioCompra: e.target.value })} />

          <input className="border p-2" type="number" placeholder="Precio Venta"
            value={form.precioVenta}
            onChange={(e) => setForm({ ...form, precioVenta: e.target.value })} />

          <input className="border p-2" type="number" placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })} />

          <input className="border p-2" placeholder="Talla"
            value={form.talla}
            onChange={(e) => setForm({ ...form, talla: e.target.value })} />

          <input className="border p-2" placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })} />

          <select className="border p-2"
            value={form.genero ? "true" : "false"}
            onChange={(e) => setForm({ ...form, genero: e.target.value === "true" })}>
            <option value="true">Masculino</option>
            <option value="false">Femenino</option>
          </select>

          <select className="border p-2"
            value={form.categoria?.idCategoria || ""}
            onChange={(e) => setForm({ ...form, categoria: { idCategoria: e.target.value } })}>
            <option value="">Seleccione Categoría</option>
            {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.categoria}</option>)}
          </select>
        </div>

        <textarea className="border p-2 w-full mt-3" rows="2" placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />

        <div className="mt-3">
          <input type="file" onChange={(e) => { setImagen(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} />
        </div>

        {preview && <img src={preview} className="mt-3 h-32 object-cover rounded-md border" />}

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button onClick={guardar} className="px-4 py-2 bg-indigo-600 text-white rounded">
            {productoEditar ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}