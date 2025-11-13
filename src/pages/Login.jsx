import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch("http://localhost:8500/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      setError(errorData.message || "Usuario o contraseña incorrectos.");
      return;
    }

    const data = await response.json();

    login({
      token: data.token,
      idEmpleado: data.idEmpleado,
      username: data.username,
      rol: data.rol,
    });

    navigate("/dashboard");
  } catch (err) {
    console.error("Error de conexión:", err);
    setError("No se pudo conectar con el servidor.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-white to-indigo-500">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <i className="bi bi-lock-fill text-indigo-600 text-5xl"></i>
          <h3 className="mt-3 text-2xl font-bold text-gray-800">Bienvenido</h3>
          <p className="text-gray-500 text-sm">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Usuario</label>
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <span className="px-3 bg-gray-100 text-gray-500">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="w-full px-3 py-2 outline-none text-gray-700"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <span className="px-3 bg-gray-100 text-gray-500">
                <i className="bi bi-key-fill"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 outline-none text-gray-700"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="px-3 text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
              </button>
            </div>
          </div>

          {/* Datos de prueba */}
          <div className="text-xs text-gray-500 mt-2">
            <p>DATOS DE LA BD PARA INICIAR SESIÓN:</p>
            <p>usuario: <span className="font-semibold">admin</span> // contraseña: <span className="font-semibold">admin123</span></p>
          </div>

          {/* Botón */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <i className="bi bi-box-arrow-in-right"></i>
              Iniciar sesión
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 text-center bg-indigo-100 text-indigo-700 text-sm font-medium py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              ¿No tienes una cuenta?{" "}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}