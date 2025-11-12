import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

export default function Reportes() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8500/api/ventas/listar")
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((err) => console.error("Error al obtener ventas:", err));
  }, []);

  const verDetalle = async (idVenta) => {
    try {
      const res = await fetch(`http://localhost:8500/api/ventas/${idVenta}`);
      const data = await res.json();
      setVentaSeleccionada(data);
      setMostrarModal(true);
    } catch (error) {
      console.error("Error al obtener detalle de venta:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        Reporte de Ventas
      </h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Total (S/)</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <tr
                  key={venta.idVenta}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-2 px-4">{venta.idVenta}</td>
                  <td className="py-2 px-4">
                    {venta.cliente?.nombre || "CLIENTE VARIOS"}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(venta.fechaVenta).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 font-semibold text-purple-700">
                    S/ {venta.total.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => verDetalle(venta.idVenta)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 mx-auto hover:bg-indigo-700 transition"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-4 italic"
                >
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle */}
      {mostrarModal && ventaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <h2 className="text-xl font-bold text-purple-700 mb-3">
              Detalle de Venta #{ventaSeleccionada.idVenta}
            </h2>
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 font-bold text-lg"
            >
              ✕
            </button>

            {/* Datos generales */}
            <div className="mb-4 border-b pb-3">
              <p>
                <strong>Cliente:</strong>{" "}
                {ventaSeleccionada.cliente?.nombre || "CLIENTE VARIOS"}
              </p>
              <p>
                <strong>Documento:</strong>{" "}
                {ventaSeleccionada.cliente?.documento || "—"}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(ventaSeleccionada.fechaVenta).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong>{" "}
                <span className="text-purple-700 font-semibold">
                  S/ {ventaSeleccionada.total.toFixed(2)}
                </span>
              </p>
            </div>

            {/* Detalle de productos */}
            <h3 className="text-lg font-semibold mb-2">Productos Vendidos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mb-3">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-3">Producto</th>
                    <th className="py-2 px-3">Cantidad</th>
                    <th className="py-2 px-3">Precio (S/)</th>
                    <th className="py-2 px-3">Subtotal (S/)</th>
                  </tr>
                </thead>
                <tbody>
                  {ventaSeleccionada.detalleVenta?.map((d, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-3">{d.producto?.nombre}</td>
                      <td className="py-2 px-3 text-center">{d.stock}</td>
                      <td className="py-2 px-3 text-center">
                        S/ {d.producto?.precio.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        S/ {d.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Método de pago */}
            <div className="mt-3 border-t pt-3">
              <p>
                <strong>Método de Pago:</strong>{" "}
                {ventaSeleccionada.detalleVenta?.[0]?.metodoPago || "No especificado"}
              </p>
              <p>
                <strong>Monto Pagado:</strong> S/{" "}
                {ventaSeleccionada.detalleVenta?.[0]?.montoPagado?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Vuelto:</strong> S/{" "}
                {ventaSeleccionada.detalleVenta?.[0]?.vuelto?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-indigo-700 text-white px-5 py-2 rounded-lg hover:bg-indigo-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
