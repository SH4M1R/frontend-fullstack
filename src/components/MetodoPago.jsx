import React from "react";

export default function MetodoPago({ metodo, setMetodo }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Método de Pago:
      </label>
      <div className="flex gap-2">
        {["efectivo", "yape", "izipay"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMetodo(m)}
            className={`px-3 py-1 rounded-lg text-sm capitalize ${
              metodo === m
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
