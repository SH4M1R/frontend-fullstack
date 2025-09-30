import React, { useState, useEffect } from "react";
import AgregarProducto from "../components/AgregarProducto";
import AgregarCategoria from "../components/AgregarCategoria";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);

  const [editProductoIndex, setEditProductoIndex] = useState(null);
  const [editCategoriaIndex, setEditCategoriaIndex] = useState(null);

  useEffect(() => {
    const storedProductos = localStorage.getItem("productos");
    const storedCategorias = localStorage.getItem("categorias");
    if (storedProductos) setProductos(JSON.parse(storedProductos));
    if (storedCategorias) setCategorias(JSON.parse(storedCategorias));
  }, []);

  const actualizarProductos = (lista) => {
    setProductos(lista);
    localStorage.setItem("productos", JSON.stringify(lista));
  };

  const actualizarCategorias = (lista) => {
    setCategorias(lista);
    localStorage.setItem("categorias", JSON.stringify(lista));
  };

  const guardarProducto = (producto) => {
    if (editProductoIndex !== null) {
      const actualizados = [...productos];
      actualizados[editProductoIndex] = {
        ...producto,
        idProducto: productos[editProductoIndex].idProducto,
        Categoria: Number(producto.Categoria),
      };
      actualizarProductos(actualizados);
      setEditProductoIndex(null);
    } else {
      const nuevos = [
        ...productos,
        {
          idProducto: Date.now(),
          ...producto,
          Categoria: Number(producto.Categoria),
        },
      ];
      actualizarProductos(nuevos);
    }
    setModalProductoOpen(false);
  };

  const guardarCategoria = (categoria) => {
    if (editCategoriaIndex !== null) {
      const actualizadas = [...categorias];
      actualizadas[editCategoriaIndex] = {
        ...categoria,
        idCategoria: categorias[editCategoriaIndex].idCategoria,
      };
      actualizarCategorias(actualizadas);
      setEditCategoriaIndex(null);
    } else {
      const nuevas = [
        ...categorias,
        { idCategoria: Date.now(), ...categoria },
      ];
      actualizarCategorias(nuevas);
    }
    setModalCategoriaOpen(false);
  };

  const editarProducto = (index) => {
    setEditProductoIndex(index);
    setModalProductoOpen(true);
  };

  const eliminarProducto = (index) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      const actualizados = productos.filter((_, i) => i !== index);
      actualizarProductos(actualizados);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
          📦 Gestión de Productos
        </h2>
        <div className="space-x-3">
          <button onClick={() => {
              setEditProductoIndex(null);
              setModalProductoOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
          > + Nuevo Producto </button>

          <button onClick={() => {
              setEditCategoriaIndex(null);
              setModalCategoriaOpen(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-500"
          > + Nueva Categoría </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 text-center">
              <tr>
                <th className="border px-2 py-3">ID</th>
                <th className="border px-2 py-3">Producto</th>
                <th className="border px-2 py-3">Precio Compra</th>
                <th className="border px-2 py-3">Precio Venta</th>
                <th className="border px-2 py-3">Stock</th>
                <th className="border px-2 py-3">Talla</th>
                <th className="border px-2 py-3">Color</th>
                <th className="border px-2 py-3">Foto</th>
                <th className="border px-2 py-3">Género</th>
                <th className="border px-2 py-3">Categoría</th>
                <th className="border px-2 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length > 0 ? (
                productos.map((p, index) => (
                  <tr
                    key={p.idProducto}
                    className="text-center hover:bg-gray-50"
                  >
                    <td className="border px-2 py-2">{p.idProducto}</td>
                    <td className="border px-2 py-2 font-medium">{p.Producto}</td>
                    <td className="border px-2 py-2 text-blue-600 font-semibold">
                      S/ {p.PrecioCompra}
                    </td>
                    <td className="border px-2 py-2 text-green-600 font-semibold">
                      S/ {p.PrecioVenta}
                    </td>
                    <td className="border px-2 py-2">{p.Stock}</td>
                    <td className="border px-2 py-2">{p.Talla}</td>
                    <td className="border px-2 py-2">{p.Color}</td>
                    <td className="border px-2 py-2">
                      {p.Foto ? (
                        <img src={p.Foto} alt={p.Producto} className="h-10 w-10 object-cover mx-auto rounded shadow" />
                      ) : (  "—" )}
                    </td>
                    <td className="border px-2 py-2">
                      {p.Genero ? "Masculino" : "Femenino"}
                    </td>
                    <td className="border px-2 py-2">
                      { categorias.find( (c) => c.idCategoria === Number(p.Categoria) )?.nombre || "—" }
                    </td>
                    <td className="border px-2 py-2 space-x-2">
                      <button onClick={() => editarProducto(index)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400 shadow" > ✏️ </button>
                      <button onClick={() => eliminarProducto(index)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 shadow" > 🗑️ </button>
                    </td>
                  </tr>
                )) ) : (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-gray-500 italic"
                  > No hay productos registrados </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {modalProductoOpen && (
        <AgregarProducto
          onClose={() => setModalProductoOpen(false)}
          onSave={guardarProducto}
          initialData={
            editProductoIndex !== null ? productos[editProductoIndex] : null
          }
          categorias={categorias}
        />
      )}

      {modalCategoriaOpen && (
        <AgregarCategoria
          onClose={() => setModalCategoriaOpen(false)}
          onSave={guardarCategoria}
          initialData={
            editCategoriaIndex !== null ? categorias[editCategoriaIndex] : null
          }
        />
      )}
    </div>
  );
}