import React, { useState } from "react";

export default function MetodoPago({ total, onClose }) {
  const [metodo, setMetodo] = useState(null);
  const [efectivo, setEfectivo] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [boleta, setBoleta] = useState("");

  const vuelto = efectivo ? Number(efectivo) - total : 0;

  const procesarPago = () => {
    if (!metodo) {
      alert("Selecciona un método de pago.");
      return;
    }
    if (metodo === "efectivo" && (!efectivo || Number(efectivo) < total)) {
      alert("El monto recibido debe ser mayor o igual al total.");
      return;
    }
    if (metodo === "izipay" && (tarjeta.length !== 4 || !boleta)) {
      alert("Ingresa los últimos 4 dígitos de la tarjeta y el número de boleta.");
      return;
    }

    alert("Pago procesado correctamente ✅");
    onClose();
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          💳 Método de Pago
        </h2>
        <p className="text-center text-gray-700 mb-6 text-lg">
          Total a pagar: <span className="font-semibold text-green-600">S/ {total.toFixed(2)}</span>
        </p>

        {/* Selección de método */}
        {!metodo && (
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setMetodo("efectivo")}
              className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transform transition-all duration-200 bg-gradient-to-r from-green-500 to-green-700"
            >
              Efectivo
            </button>
            <button
              onClick={() => setMetodo("yape")}
              className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transform transition-all duration-200 bg-gradient-to-r from-purple-500 to-purple-700"
            >
              Yape
            </button>
            <button
              onClick={() => setMetodo("izipay")}
              className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transform transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-700"
            >
              Izipay
            </button>
          </div>
        )}

        {/* Efectivo */}
        {metodo === "efectivo" && (
          <div className="bg-green-50 p-5 rounded-2xl mb-4 shadow-inner border border-green-200">
            <label className="block mb-2 font-medium text-green-700">Monto recibido:</label>
            <input
              type="number"
              value={efectivo}
              onChange={(e) => setEfectivo(e.target.value)}
              placeholder="Ingrese el monto"
              className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="mt-2 text-lg">
              Vuelto:{" "}
              <span className={vuelto < 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                S/ {vuelto.toFixed(2)}
              </span>
            </p>
          </div>
        )}

        {/* Yape */}
        {metodo === "yape" && (
          <div className="bg-purple-50 p-6 rounded-2xl mb-4 shadow-inner border border-purple-200 flex flex-col items-center">
            <p className="mb-3 text-purple-700 font-medium">Escanea este código QR:</p>
            <img
              src="https://via.placeholder.com/150x150.png?text=QR+Yape"
              alt="QR Yape"
              className="border-2 border-purple-300 rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Izipay */}
        {metodo === "izipay" && (
          <div className="bg-blue-50 p-5 rounded-2xl mb-4 shadow-inner border border-blue-200 space-y-3">
            <label className="block font-medium text-blue-700">Últimos 4 dígitos de la tarjeta:</label>
            <input
              type="text"
              maxLength={4}
              value={tarjeta}
              onChange={(e) => setTarjeta(e.target.value)}
              placeholder="1234"
              className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="block font-medium text-blue-700">Número de boleta:</label>
            <input
              type="text"
              value={boleta}
              onChange={(e) => setBoleta(e.target.value)}
              placeholder="Ingrese nro de boleta"
              className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col gap-3 mt-4">
          <button onClick={onClose}
            className="w-full py-2 rounded-2xl bg-gray-400 text-white font-semibold hover:bg-gray-500 transition-colors shadow"
          > ❌ Cancelar </button>
          <button onClick={procesarPago}
            className="w-full py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:scale-105 transform transition-all duration-200"
          > ✅ Confirmar Pago </button>
        </div>
      </div>
    </div>
  );
}