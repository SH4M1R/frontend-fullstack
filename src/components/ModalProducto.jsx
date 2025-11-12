import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ModalProducto({ isOpen, onClose, productoEditar }) {
  const { authFetch } = useAuth();
  const BASE_URL = "http://localhost:8500/api";

  const [categorias, setCategorias] = useState([]);
  const [preview, setPreview] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    categoria: null,
  });

  // Cargar categorías y datos del producto (si se edita)
  useEffect(() => {
    if (!isOpen) return;

    const fetchCategorias = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/categorias`);
        if (!res.ok) throw new Error("Error al cargar categorías");
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las categorías.");
      }
    };

    fetchCategorias();

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
        categoria: { idCategoria: productoEditar.categoria?.idCategoria },
      });
      setPreview(`${BASE_URL}${productoEditar.imagen}`);
    } else {
      setForm({
        producto: "",
        precioCompra: "",
        precioVenta: "",
        descripcion: "",
        estado: true,
        stock: "",
        talla: "",
        color: "",
        genero: true,
        categoria: null,
      });
      setPreview(null);
    }
  }, [isOpen, productoEditar]);

  // Manejo de cambios de campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "categoria") {
      setForm({ ...form, categoria: { idCategoria: parseInt(value) } });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Guardar producto
  const guardar = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("producto", new Blob([JSON.stringify(form)], { type: "application/json" }));
      if (imagen) formData.append("imagen", imagen);

      const url = `${BASE_URL}/productos${productoEditar ? `/${productoEditar.idProducto}` : ""}`;
      const method = productoEditar ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error(`Error al ${productoEditar ? "actualizar" : "crear"} el producto`);

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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