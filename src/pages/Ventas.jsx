import React, { useState, useEffect } from "react";
import axios from "axios";
import MetodoPago from "../Components/MetodoPago";
import { ShoppingCart, PlusIcon, MinusIcon, TrashIcon } from "lucide-react";

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState({ nombre: "", documento: "" });
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [total, setTotal] = useState(0);
  const [montoRecibido, setMontoRecibido] = useState(0);
  const [vuelto, setVuelto] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategorias] = useState([]);

  // Cargar productos y categorías
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

  // Calcular total
  useEffect(() => {
    const totalCalc = carrito.reduce(
      (acc, item) => acc + item.precioVenta * item.cantidad,
      0
    );
    setTotal(totalCalc);
  }, [carrito]);

  // Calcular vuelto si es efectivo
  useEffect(() => {
    if (metodoPago === "efectivo") {
      setVuelto(montoRecibido - total > 0 ? montoRecibido - total : 0);
    } else {
      setVuelto(0);
    }
  }, [montoRecibido, total, metodoPago]);

  // Agregar producto al carrito
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

  // Incrementar, decrementar y eliminar productos
  const incrementar = (id) =>
    setCarrito(
      carrito.map((p) =>
        p.idProducto === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );

  const decrementar = (id) =>
    setCarrito(
      carrito.map((p) =>
        p.idProducto === id
          ? { ...p, cantidad: Math.max(p.cantidad - 1, 1) }
          : p
      )
    );

  const eliminar = (id) => setCarrito(carrito.filter((p) => p.idProducto !== id));

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const matchSearch = p.producto
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchCategory =
      categoryFilter === "" || p.categoria?.idCategoria == categoryFilter;
    return matchSearch && matchCategory;
  });

  // Finalizar venta
  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      alert("Agrega productos al carrito antes de registrar la venta.");
      return;
    }

    if (metodoPago === "efectivo" && montoRecibido < total) {
      alert("El monto recibido debe ser igual o mayor al total.");
      return;
    }

    const venta = {
      total: total,
      cliente: {
        nombre: cliente.nombre || "CLIENTE VARIOS",
        documento: cliente.documento || "",
      },
      detalles: carrito.map((p) => ({
        producto: { idProducto: p.idProducto },
        stock: p.cantidad,
        subtotal: p.precioVenta * p.cantidad,
        metodoPago: metodoPago,
        montoPagado: metodoPago === "efectivo" ? montoRecibido : total,
        vuelto: metodoPago === "efectivo" ? vuelto : 0,
        codigoIzipay: metodoPago === "izipay" ? "123456" : "",
        numeroTarjeta: metodoPago === "tarjeta" ? "**** **** **** 1234" : "",
      })),
    };

    try {
      const res = await axios.post(
        "http://localhost:8500/api/ventas/registrar",
        venta
      );
      alert("Venta registrada con éxito");
      setCarrito([]);
      setCliente({ nombre: "", documento: "" });
      setTotal(0);
      setMontoRecibido(0);
      setVuelto(0);
      console.log("Venta registrada:", res.data);
    } catch (error) {
      console.error("Error Axios:", error.response?.data || error.message);
      alert("Error al registrar la venta: " + (error.response?.data || ""));
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Listado de productos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {productosFiltrados.length === 0 ? (
            <p className="text-gray-500 col-span-4 text-center">
              No hay productos disponibles
            </p>
          ) : (
            productosFiltrados.map((p) => (
              <div
                key={p.idProducto}
                className="border rounded-xl p-3 shadow-sm flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm mb-2">
                  {p.imagen ? (
                    <img
                      src={`http://localhost:8500${p.imagen}`}
                      alt={p.producto}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    "Sin Imagen"
                  )}
                </div>
                <p className="font-semibold text-center">{p.producto}</p>
                <p className="text-gray-600 text-sm">Stock: {p.stock}</p>
                <p className="text-gray-600 text-sm">
                  CATEGORÍA: {p.categoria?.categoria || "Sin categoría"}
                </p>
                <p className="font-bold text-indigo-700 mb-2">
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
            <p className="text-gray-500 text-center">
              No hay productos en el carrito.
            </p>
          ) : (
            <ul className="divide-y">
              {carrito.map((item) => (
                <li
                  key={item.idProducto}
                  className="py-2 flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.producto}</span>

                    <button
                      onClick={() => decrementar(item.idProducto)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <MinusIcon className="h-4 w-4 text-gray-700" />
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      onClick={() => incrementar(item.idProducto)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <PlusIcon className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>S/ {(item.precioVenta * item.cantidad).toFixed(2)}</span>

                    <button
                      onClick={() => eliminar(item.idProducto)}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Resumen y botón final */}
        <div className="mt-6">
          <MetodoPago metodo={metodoPago} setMetodo={setMetodoPago} />

          {/* Monto recibido si es efectivo */}
          {metodoPago === "efectivo" && (
            <div className="mt-2">
              <label className="block text-sm text-gray-700">Monto recibido:</label>
              <input
                type="number"
                value={montoRecibido}
                onChange={(e) => setMontoRecibido(parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-1"
              />
              <p className="mt-1 text-gray-700">
                Vuelto: <span className="font-semibold">S/ {vuelto.toFixed(2)}</span>
              </p>
            </div>
          )}

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
