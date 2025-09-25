import React, { useState } from "react";
import { productos as dataProductos } from "../data/productos";
import MetodoPago from "../components/MetodoPago";

export default function Ventas() {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);

  const productosFiltrados = dataProductos.filter((p) =>
    p.Producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.idProducto === producto.idProducto);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.PrecioVenta * item.cantidad,
    0
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sección de productos */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">🛒 Realizar Venta</h2>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Lista de productos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((p) => (
            <div
              key={p.idProducto}
              className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition"
            >
              {p.Foto ? (
                <img
                  src={p.Foto}
                  alt={p.Producto}
                  className="h-32 w-full object-cover rounded"
                />
              ) : (
                <div className="h-32 w-full flex items-center justify-center bg-gray-200 rounded">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
              <h3 className="text-lg font-semibold mt-2">{p.Producto}</h3>
              <p className="text-gray-600 text-sm">{p.Descripcion}</p>
              <p className="text-gray-600 text-sm">Stock: {p.Stock}</p>
              <p className="text-gray-600 text-sm">Categoría: {p.categoria.nombre}</p>
              <p className="text-blue-600 font-bold">S/ {p.PrecioVenta}</p>
              <button
                onClick={() => agregarAlCarrito(p)}
                className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-500"
              >
                Agregar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="w-80 bg-white border-l p-4 flex flex-col">
        <h3 className="text-xl font-bold mb-4">🛍 Carrito</h3>

        {carrito.length === 0 ? (
          <p className="text-gray-500">No hay productos en el carrito</p>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {carrito.map((item) => (
              <div
                key={item.idProducto}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-medium">{item.Producto}</p>
                  <p className="text-sm text-gray-600">
                    {item.cantidad} x S/ {item.PrecioVenta}
                  </p>
                </div>
                <p className="font-semibold">
                  S/ {item.PrecioVenta * item.cantidad}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t pt-4 mt-4">
          <p className="text-lg font-bold">Total: S/ {total}</p>
          <button
            onClick={() => setModalPagoOpen(true)}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-500"
          >
            Finalizar Venta
          </button>
        </div>
      </div>

      {/* Modal de pago */}
      {modalPagoOpen && (
        <MetodoPago total={total} onClose={() => setModalPagoOpen(false)} />
      )}
    </div>
  );
}