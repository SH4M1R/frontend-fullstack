import React, { useState } from "react";

export default function MetodoPago({ total, onClose }) {
  const [metodo, setMetodo] = useState(null);
  const [efectivo, setEfectivo] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [boleta, setBoleta] = useState("");

  const vuelto = efectivo ? Number(efectivo) - total : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">💳 Seleccionar Método de Pago</h2>
        <p className="mb-4">
          Total a pagar: <strong>S/ {total.toFixed(2)}</strong>
        </p>

        {!metodo && (
          <div className="space-y-2">
            <button
              onClick={() => setMetodo("efectivo")}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500"
            >
              Efectivo
            </button>
            <button
              onClick={() => setMetodo("yape")}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-500"
            >
              Yape
            </button>
            <button
              onClick={() => setMetodo("izipay")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500"
            >
              Izipay
            </button>
          </div>
        )}

        {/* Efectivo */}
        {metodo === "efectivo" && (
          <div>
            <label className="block mb-2 font-medium">Monto recibido:</label>
            <input
              type="number"
              value={efectivo}
              onChange={(e) => setEfectivo(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Ingrese el monto"
            />
            <p>
              Vuelto:{" "}
              <strong className={vuelto < 0 ? "text-red-600" : "text-green-600"}>
                S/ {vuelto.toFixed(2)}
              </strong>
            </p>
          </div>
        )}

        {/* Yape */}
        {metodo === "yape" && (
          <div className="flex flex-col items-center">
            <p className="mb-2">Escanea este código QR:</p>
            <img
              src="https://via.placeholder.com/150x150.png?text=QR+Yape"
              alt="QR Yape"
              className="border p-2"
            />
          </div>
        )}

        {/* Izipay */}
        {metodo === "izipay" && (
          <div>
            <label className="block mb-2 font-medium">
              Últimos 4 dígitos de la tarjeta:
            </label>
            <input
              type="text"
              maxLength={4}
              value={tarjeta}
              onChange={(e) => setTarjeta(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="1234"
            />

            <label className="block mb-2 font-medium">Número de boleta:</label>
            <input
              type="text"
              value={boleta}
              onChange={(e) => setBoleta(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ingrese nro de boleta"
            />
          </div>
        )}

        <div className="mt-6 space-y-2">
          <button onClick={onClose} className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500">❌ Cancelar</button>
            <button onClick={() => alert('Pago procesado')} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500">✅ Confirmar Pago</button>
        </div>
      </div>
    </div>
  );
}