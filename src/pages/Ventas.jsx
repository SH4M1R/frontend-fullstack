import React, { useState } from "react";
import { productos as dataProductos } from "../data/productos";
import MetodoPago from "../components/MetodoPago";
import {
  ShoppingCartIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

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
    <div className="flex h-screen bg-gray-50">
      {/* Sección de productos */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Venta</h2>
        </div>

        {/* Buscador */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-indigo-300" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Lista de productos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((p) => (
            <div
              key={p.idProducto}
              className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition group border border-gray-100"
            >
              <div className="w-full aspect-[4/3] overflow-hidden rounded bg-white flex items-center justify-center">
                {p.Foto ? (
                  <img
                    src={p.Foto}
                    alt={p.Producto}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f8fafc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="18">Sin imagen</text></svg>';
                    }}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                )}
              </div>

              <h3 className="text-lg font-semibold mt-3 truncate text-gray-800">{p.Producto}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{p.Descripcion}</p>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock: <span className="font-medium text-gray-800">{p.Stock}</span></p>
                  <p className="text-sm text-gray-600">Cat: <span className="font-medium text-gray-800">{p.categoria.nombre}</span></p>
                </div>
                <p className="text-indigo-500 font-bold">S/ {p.PrecioVenta}</p>
              </div>

              <button
                onClick={() => agregarAlCarrito(p)}
                className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 flex items-center justify-center gap-2"
              >
                <ShoppingBagIcon className="h-4 w-4 text-white" />
                <span>Agregar</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="w-80 bg-white border-l border-gray-200 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded bg-indigo-900/10">
            <ShoppingCartIcon className="h-5 w-5 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Carrito</h3>
        </div>

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
                  <p className="font-medium text-gray-800">{item.Producto}</p>
                  <p className="text-sm text-gray-600">
                    {item.cantidad} x S/ {item.PrecioVenta}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  S/ {item.PrecioVenta * item.cantidad}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t pt-4 mt-4">
          <p className="text-lg font-bold text-gray-800">Total: <span className="text-indigo-600">S/ {total}</span></p>
          <button
            onClick={() => setModalPagoOpen(true)}
            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 flex items-center justify-center gap-2"
          >
            <CreditCardIcon className="h-5 w-5 text-white" />
            <span>Finalizar Venta</span>
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
