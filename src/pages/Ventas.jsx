import React, { useState, useEffect } from "react";
import axios from "axios";
import MetodoPago from "../Components/MetodoPago";
import { ShoppingCart } from "lucide-react";

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState({ nombre: "", documento: "" });
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [total, setTotal] = useState(0);

useEffect(() => {
  axios
    .get("http://localhost:8500/api/productos")
    .then((res) => setProductos(res.data))
    .catch(() => console.error("Error al cargar productos"));

  axios
    .get("http://localhost:8500/api/categorias")
    .then((res) => setCategorias(res.data))
    .catch(() => console.error("Error al cargar categorías"));
}, []);


  useEffect(() => {
    const totalCalc = carrito.reduce(
      (acc, item) => acc + item.precioVenta * item.cantidad,
      0
    );
    setTotal(totalCalc);
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((p) => p.idProducto === producto.idProducto);
    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.idProducto === producto.idProducto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      alert("Agrega productos al carrito antes de registrar la venta.");
      return;
    }

    const venta = {
      total: total.toFixed(2),
      cliente: {
        nombre: cliente.nombre || "CLIENTE VARIOS",
        documento: cliente.documento ? parseInt(cliente.documento) : 0,
      },
      detalles: carrito.map((p) => ({
        producto: { idProducto: p.idProducto },
        stock: p.cantidad,
        subtotal: (p.precioVenta * p.cantidad).toFixed(2),
        metodoPago: metodoPago,
        montoPagado: total.toFixed(2),
        vuelto: 0,
        codigoIzipay: "",
        numeroTarjeta: "",
      })),
    };

    try {
      await axios.post("http://localhost:8500/api/ventas/registrar", venta);
      alert("Venta registrada con éxito");
      setCarrito([]);
      setCliente({ nombre: "", documento: "" });
      setTotal(0);
    } catch (error) {
      alert("Error al registrar la venta");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-50 p-4 gap-4">
      {/* Panel de productos */}
      <div className="w-full md:w-2/3 bg-white p-6 rounded-2xl shadow-md overflow-y-auto">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          Gestión de Ventas
        </h1>

        {/* Datos del cliente */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nombre del cliente (opcional)"
            value={cliente.nombre}
            onChange={(e) =>
              setCliente({ ...cliente, nombre: e.target.value })
            }
            className="w-1/2 border border-gray-300 rounded-lg p-2 text-sm"
          />
          <input
            type="number"
            placeholder="DNI (opcional)"
            value={cliente.documento}
            onChange={(e) =>
              setCliente({ ...cliente, documento: e.target.value })
            }
            className="w-1/2 border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>

        {/* Búsqueda y filtro */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
          />
          <select className="border border-gray-300 rounded-lg p-2 text-sm">
            <option>Todas las categorías</option>
          </select>
        </div>

        {/* Listado de productos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {productos.length === 0 ? (
            <p className="text-gray-500 col-span-4 text-center">
              No hay productos disponibles
            </p>
          ) : (
            productos.map((p) => (
              <div
                key={p.idProducto}
                className="border rounded-xl p-3 shadow-sm flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm mb-2">
                  {p.imagen ? (
                    <img
                      src={p.imagen}
                      alt={p.producto}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    "Sin Imagen"
                  )}
                </div>
                <p className="font-semibold text-center">{p.producto}</p>
                <p className="text-gray-600 text-sm">Stock: {p.stock}</p>
                <p className="text-gray-600 text-sm">CAT: {p.categoria?.nombre}</p>
                <p className="font-bold text-purple-700 mb-2">
                  S/ {p.precioVenta}
                </p>
                <button
                  onClick={() => agregarAlCarrito(p)}
                  className="bg-indigo-600 text-white rounded-lg px-3 py-1 text-sm hover:bg-indigo-700 transition"
                >
                  Agregar
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panel del carrito */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
            <ShoppingCart /> Carrito
          </h2>

          {carrito.length === 0 ? (
            <p className="text-gray-500 text-center">No hay productos en el carrito.</p>
          ) : (
            <ul className="divide-y">
              {carrito.map((item) => (
                <li key={item.idProducto} className="py-2 flex justify-between text-sm">
                  <span>
                    {item.producto} x{item.cantidad}
                  </span>
                  <span>S/ {(item.precioVenta * item.cantidad).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Resumen y botón final */}
        <div className="mt-6">
          <MetodoPago metodo={metodoPago} setMetodo={setMetodoPago} />

          <div className="flex justify-between items-center mt-4 text-lg font-semibold">
            <span>Total:</span>
            <span className="text-indigo-700">S/ {total.toFixed(2)}</span>
          </div>

          <button
            onClick={finalizarVenta}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
          >
            <ShoppingCart /> Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
}
