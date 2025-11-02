import React, { useEffect, useState } from "react";
import ModalProducto from "../components/ModalProducto";
import ModalCategoria from "../components/ModalCategoria";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModalProducto, setShowModalProducto] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const API_URL = "http://localhost:8500/api/productos";

  const cargarProductos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Convertir tallas y colores a arrays si vienen como string
      const productosFormateados = data.map(p => ({
        ...p,
        talla: p.talla ? p.talla.split(",") : [],
        color: p.color ? p.color.split(",") : [],
      }));
      setProductos(productosFormateados);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.producto.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = productosFiltrados.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const toggleEstado = async (producto) => {
    try {
      const body = {
        ...producto,
        estado: !producto.estado,
        categoria: { idCategoria: producto.categoria.idCategoria },
        talla: producto.talla.join(","),
        color: producto.color.join(","),
      };

      await fetch(`${API_URL}/${producto.idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      cargarProductos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado(producto);
    setShowModalProducto(true);
  };

  const abrirModalCreacion = () => {
    setProductoEditado(null);
    setShowModalProducto(true);
  };

  return (
    <div className="p-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Gestión de Productos
        </h1>
        <div className="space-x-2">
          <button
            onClick={abrirModalCreacion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Crear Producto
          </button>
          <button
            onClick={() => setShowModalCategoria(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Crear Categoría
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Precio Compra</th>
              <th className="px-4 py-3">Precio Venta</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Tallas</th>
              <th className="px-4 py-3">Colores</th>
              <th className="px-4 py-3">Género</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-center">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((p) => (
                <tr key={p.idProducto} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.producto}</td>
                  <td className="px-4 py-2">{p.descripcion}</td>
                  <td className="px-4 py-2">S/ {p.precioCompra}</td>
                  <td className="px-4 py-2">S/ {p.precioVenta}</td>
                  <td className="px-4 py-2">{p.stock}</td>
                  <td className="px-4 py-2">{p.talla?.join(", ")}</td>
                  <td className="px-4 py-2">{p.color?.join(", ")}</td>
                  <td className="px-4 py-2">{p.genero ? "Masculino" : "Femenino"}</td>
                  <td className="px-4 py-2">{p.categoria?.categoria}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        p.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.estado ? "Habilitado" : "Deshabilitado"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => abrirModalEdicion(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(p.idProducto)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => toggleEstado(p)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded"
                    >
                      {p.estado ? "Deshabilitar" : "Habilitar"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-4" colSpan="11">
                  No hay productos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label className="text-sm text-gray-700">Mostrar: </label>
          <select
            className="ml-2 border rounded px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Modales */}
      {showModalProducto && (
        <ModalProducto
          onClose={() => setShowModalProducto(false)}
          recargarProductos={cargarProductos}
          productoEditado={productoEditado}
        />
      )}

      {showModalCategoria && (
        <ModalCategoria
          onClose={() => setShowModalCategoria(false)}
          recargarProductos={cargarProductos}
        />
      )}
    </div>
  );
}
