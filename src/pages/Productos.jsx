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

  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  const guardarProducto = (producto) => {
    if (editProductoIndex !== null) {
      const actualizados = [...productos];
      actualizados[editProductoIndex] = {
        ...producto,
        idProducto: productos[editProductoIndex].idProducto,
      };
      setProductos(actualizados);
      setEditProductoIndex(null);
    } else {
      setProductos([
        ...productos,
        { idProducto: productos.length + 1, ...producto },
      ]);
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
      setCategorias(actualizadas);
      setEditCategoriaIndex(null);
    } else {
      setCategorias([
        ...categorias,
        { idCategoria: categorias.length + 1, ...categoria },
      ]);
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
      setProductos(actualizados);
    }
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📋 Lista de Productos</h2>
        <div className="space-x-2">
          <button nClick={() => { etEditProductoIndex(null); setModalProductoOpen(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500" >  ➕ Agregar Producto </button>

          <button onClick={() => { setEditCategoriaIndex(null); setModalCategoriaOpen(true); }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500" > ➕ Agregar Categoría </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Producto</th>
              <th className="border px-2 py-2">Precio Compra</th>
              <th className="border px-2 py-2">Precio Venta</th>
              <th className="border px-2 py-2">Stock</th>
              <th className="border px-2 py-2">Talla</th>
              <th className="border px-2 py-2">Color</th>
              <th className="border px-2 py-2">Foto</th>
              <th className="border px-2 py-2">Género</th>
              <th className="border px-2 py-2">Categoría</th>
              <th className="border px-2 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((p, index) => (
                <tr key={p.idProducto} className="text-center hover:bg-gray-50">
                  <td className="border px-2 py-2">{p.idProducto}</td>
                  <td className="border px-2 py-2">{p.Producto}</td>
                  <td className="border px-2 py-2">S/ {p.PrecioCompra}</td>
                  <td className="border px-2 py-2">S/ {p.PrecioVenta}</td>
                  <td className="border px-2 py-2">{p.Stock}</td>
                  <td className="border px-2 py-2">{p.Talla}</td>
                  <td className="border px-2 py-2">{p.Color}</td>
                  <td className="border px-2 py-2">
                    {p.Foto ? (
                      <img src={p.Foto} alt={p.Producto} className="h-10 w-10 object-cover mx-auto rounded" />
                    ) : ( "—" )}
                  </td>
                  <td className="border px-2 py-2">
                    {p.Genero ? "Masculino" : "Femenino"}
                  </td>
                  <td className="border px-2 py-2">
                    { categorias.find( (c) => c.idCategoria === Number(p.Categoria) )?.nombre || "—" }
                  </td>
                  <td className="border px-2 py-2 space-x-2">
                    <button onClick={() => editarProducto(index)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400" > ✏️ </button>
                    <button onClick={() => eliminarProducto(index)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500" > 🗑️ </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {modalProductoOpen && (
        <AgregarProducto
          onClose={() => setModalProductoOpen(false)}
          onSave={guardarProducto}
          initialData={editProductoIndex !== null ? productos[editProductoIndex] : null}
        />
      )}

      {modalCategoriaOpen && (
        <AgregarCategoria
          onClose={() => setModalCategoriaOpen(false)}
          onSave={guardarCategoria}
          initialData={editCategoriaIndex !== null ? categorias[editCategoriaIndex] : null}
        />
      )}
    </div>
  );
}