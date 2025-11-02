import React, { useState, useEffect } from "react";

export default function ModalProducto({ onClose, recargarProductos, productoEditado }) {
  const [producto, setProducto] = useState({
    producto: "",
    descripcion: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    talla: [],
    color: [],
    genero: true, // true = masculino, false = femenino
    estado: true,
    categoria: null,
  });

  const [categorias, setCategorias] = useState([]);

  const tallasOpciones = ["XS", "S", "M", "L", "XL", "XXL"];
  const coloresOpciones = ["Negro", "Blanco", "Azul", "Rojo"];

  const API_PRODUCTOS = "http://localhost:8500/api/productos";
  const API_CATEGORIAS = "http://localhost:8500/api/categorias";

  // Cargar categorías
  useEffect(() => {
    fetch(API_CATEGORIAS)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  // Si editamos producto
  useEffect(() => {
    if (productoEditado) {
      setProducto({
        producto: productoEditado.producto || "",
        descripcion: productoEditado.descripcion || "",
        precioCompra: productoEditado.precioCompra || "",
        precioVenta: productoEditado.precioVenta || "",
        stock: productoEditado.stock || "",
        talla: productoEditado.talla ? productoEditado.talla.split(",") : [],
        color: productoEditado.color ? productoEditado.color.split(",") : [],
        genero: productoEditado.genero ?? true,
        estado: productoEditado.estado ?? true,
        categoria: productoEditado.categoria || null,
        idProducto: productoEditado.idProducto,
      });
    }
  }, [productoEditado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleCheckboxChange = (e, tipo) => {
    const { value, checked } = e.target;
    if (tipo === "talla") {
      setProducto({
        ...producto,
        talla: checked
          ? [...producto.talla, value]
          : producto.talla.filter((t) => t !== value),
      });
    } else if (tipo === "color") {
      setProducto({
        ...producto,
        color: checked
          ? [...producto.color, value]
          : producto.color.filter((c) => c !== value),
      });
    }
  };

  const handleGeneroChange = (valor) => {
    setProducto({ ...producto, genero: valor });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (!producto.categoria) {
      alert("Seleccione una categoría");
      return;
    }

    // Preparar body exacto para el backend
    const body = {
      producto: producto.producto,
      descripcion: producto.descripcion,
      precioCompra: Number(producto.precioCompra),
      precioVenta: Number(producto.precioVenta),
      stock: Number(producto.stock),
      talla: producto.talla.join(","), // backend espera string
      color: producto.color.join(","), // backend espera string
      genero: producto.genero,
      estado: producto.estado,
      categoria: { idCategoria: producto.categoria.idCategoria },
    };

    // Determinar método y URL según si es creación o edición
    const method = producto.idProducto ? "PUT" : "POST";
    const url = producto.idProducto
      ? `${API_PRODUCTOS}/${producto.idProducto}`
      : API_PRODUCTOS;

    // Petición al backend
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    // Refrescar lista y cerrar modal
    recargarProductos();
    onClose();
  } catch (err) {
    console.error("Error al guardar producto:", err);
    alert("Ocurrió un error al guardar el producto. Revisa la consola.");
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {producto.idProducto ? "Editar Producto" : "Crear Producto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre y descripción */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Producto</label>
              <input
                type="text"
                name="producto"
                value={producto.producto}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Precios y stock */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Precio Compra</label>
              <input
                type="number"
                name="precioCompra"
                value={producto.precioCompra}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                step="0.01"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Precio Venta</label>
              <input
                type="number"
                name="precioVenta"
                value={producto.precioVenta}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                step="0.01"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Stock</label>
              <input
                type="number"
                name="stock"
                value={producto.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block mb-1 font-semibold">Categoría</label>
            <select
              value={producto.categoria?.idCategoria || ""}
              onChange={(e) =>
                setProducto({
                  ...producto,
                  categoria: categorias.find(
                    (cat) => cat.idCategoria === Number(e.target.value)
                  ),
                })
              }
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Selecciona una categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.categoria}
                </option>
              ))}
            </select>
          </div>

          {/* Género */}
          <div>
            <label className="block mb-1 font-semibold">Género</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="genero"
                  checked={producto.genero === true}
                  onChange={() => handleGeneroChange(true)}
                />
                Masculino
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="genero"
                  checked={producto.genero === false}
                  onChange={() => handleGeneroChange(false)}
                />
                Femenino
              </label>
            </div>
          </div>

          {/* Tallas */}
          <div>
            <label className="block mb-1 font-semibold">Tallas</label>
            <div className="flex gap-4 flex-wrap">
              {tallasOpciones.map((t) => (
                <label
                  key={t}
                  className={`flex items-center gap-1 px-2 py-1 border rounded cursor-pointer ${
                    producto.talla.includes(t) ? "bg-blue-100 border-blue-400" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    value={t}
                    checked={producto.talla.includes(t)}
                    onChange={(e) => handleCheckboxChange(e, "talla")}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* Colores */}
          <div>
            <label className="block mb-1 font-semibold">Colores</label>
            <div className="flex gap-4 flex-wrap">
              {coloresOpciones.map((c) => (
                <label
                  key={c}
                  className={`flex items-center gap-1 px-2 py-1 border rounded cursor-pointer ${
                    producto.color.includes(c) ? "bg-blue-100 border-blue-400" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    value={c}
                    checked={producto.color.includes(c)}
                    onChange={(e) => handleCheckboxChange(e, "color")}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {producto.idProducto ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
