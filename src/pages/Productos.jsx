import React, { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import ModalProducto from "../components/ModalProducto";
import ModalCategoria from "../components/ModalCategoria";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const productosPorPagina = 25;

  // Cargar productos
  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:8500/api/productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.producto?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosFiltrados.slice(
    indiceInicio,
    indiceInicio + productosPorPagina
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const eliminarProducto = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await fetch(`http://localhost:8500/api/productos/${id}`, {
          method: "DELETE",
        });
        cargarProductos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const abrirModal = (producto = null) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
    setMostrarModal(false);
    cargarProductos();
  };

  const cerrarModalCategoria = () => {
    setMostrarModalCategoria(false);
    cargarProductos();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Gestión de Productos
      </h1>

      {/* Buscador y botones */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring focus:ring-indigo-200"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarModalCategoria(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow"
          >
            + Categoría
          </button>
          <button
            onClick={() => abrirModal()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow"
          >
            + Producto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Precio Compra</th>
              <th className="p-2 border">Precio Venta</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Talla</th>
              <th className="p-2 border">Color</th>
              <th className="p-2 border">Género</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Categoría</th>
              <th className="p-2 border">Imagen</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPagina.map((p) => (
              <tr key={p.idProducto} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{p.idProducto}</td>
                <td className="p-2 border">{p.producto}</td>
                <td className="p-2 border text-center">{p.precioCompra}</td>
                <td className="p-2 border text-center">{p.precioVenta}</td>
                <td className="p-2 border text-center">{p.stock}</td>
                <td className="p-2 border text-center">{p.talla}</td>
                <td className="p-2 border text-center">{p.color}</td>
                <td className="p-2 border text-center">
                  {p.genero ? "Masculino" : "Femenino"}
                </td>
                <td className="p-2 border text-center">
                  {p.estado ? "Activo" : "Inactivo"}
                </td>
                <td className="p-2 border text-center">
                  {p.categoria?.categoria}
                </td>
                <td className="p-2 border text-center">
                  {p.imagen ? (
                    <img
                      src={`http://localhost:8500/upload/${p.imagen}`}
                      alt="imagen"
                      className="w-12 h-12 object-cover rounded mx-auto"
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td className="p-2 border text-center space-x-2">
                  <button onClick={() => abrirModal(p)}>
                    <PencilIcon className="h-5 text-indigo-600 cursor-pointer" />
                  </button>
                  <button onClick={() => eliminarProducto(p.idProducto)}>
                    <TrashIcon className="h-5 text-red-600 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPaginaActual(num)}
            className={`px-3 py-1 rounded-md ${
              paginaActual === num
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Modales */}
      {mostrarModal && (
        <ModalProducto
          producto={productoSeleccionado}
          onClose={cerrarModal}
        />
      )}

      {mostrarModalCategoria && (
        <ModalCategoria onClose={cerrarModalCategoria} />
      )}
    </div>
  );
}
