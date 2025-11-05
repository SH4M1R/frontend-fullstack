import React, { useState, useEffect } from "react";
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

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarData = async () => {
      const resProductos = await fetch("http://localhost:8500/api/productos");
      const dataProductos = await resProductos.json();

      const resCategorias = await fetch("http://localhost:8500/api/categorias");
      const dataCategorias = await resCategorias.json();

      setProductos(dataProductos);
      setCategorias(dataCategorias);
    };
    cargarData();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.producto?.toLowerCase().includes(busqueda.toLowerCase())
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
    (acc, item) => acc + item.precioVenta * item.cantidad,
    0
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sección de productos */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ventas</h2>

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
            <div key={p.idProducto} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition group border border-gray-100">
              
              {/* Imagen */}
              <div className="w-full aspect-[4/3] overflow-hidden rounded bg-gray-50 flex items-center justify-center">
                {p.imagen ? (
                  <img
                    src={`http://localhost:8500${p.imagen}`}
                    alt={p.producto}
                    className="w-full h-full object-contain group-hover:scale-105 transition"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Sin Imagen</span>
                )}
              </div>

              <h3 className="text-lg font-semibold mt-3 truncate text-gray-800">
                {p.producto}
              </h3>

              <div className="mt-3 flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">
                    Stock: <span className="font-medium text-gray-800">{p.stock}</span>
                  </p>
                  <p className="text-gray-600">
                    CAT: <span className="font-medium text-gray-800">
                      {p.categoria?.categoria || "—"}
                    </span>
                  </p>
                </div>
                <p className="text-indigo-500 font-bold">S/ {p.precioVenta}</p>
              </div>

              <button
                onClick={() => agregarAlCarrito(p)}
                disabled={p.stock <= 0}
                className={`mt-3 w-full py-2 rounded flex items-center justify-center gap-2 text-white 
                ${p.stock > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-400 cursor-not-allowed"}`}
              >
                <ShoppingBagIcon className="h-4 w-4" />
                <span>{p.stock > 0 ? "Agregar" : "Sin Stock"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="w-80 bg-white border-l border-gray-200 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCartIcon className="h-5 w-5 text-indigo-500" />
          <h3 className="text-xl font-bold text-gray-800">Carrito</h3>
        </div>

        {carrito.length === 0 ? (
          <p className="text-gray-500">No hay productos en el carrito</p>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {carrito.map((item) => (
              <div key={item.idProducto} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium text-gray-800">{item.producto}</p>
                  <p className="text-sm text-gray-600">
                    {item.cantidad} x S/ {item.precioVenta}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  S/ {item.precioVenta * item.cantidad}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t pt-4 mt-4">
          <p className="text-lg font-bold text-gray-800">
            Total: <span className="text-indigo-600">S/ {total}</span>
          </p>

          <button
            onClick={() => setModalPagoOpen(true)}
            disabled={carrito.length === 0}
            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 flex items-center justify-center gap-2"
          >
            <CreditCardIcon className="h-5 w-5 text-white" />
            <span>Finalizar Venta</span>
          </button>
        </div>
      </div>

      {/* Modal de pago */}
      {modalPagoOpen && (
        <MetodoPago total={total} onClose={() => setModalPagoOpen(false)} carrito={carrito} />
      )}
    </div>
  );
}
