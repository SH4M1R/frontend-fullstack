// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Signup() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     nombres: "",
//     apellidos: "",
//     email: "",
//     telefono: "",
//     contrasena: "",
//     confirmarContrasena: "",
//     metodo2FA: "email", // Siempre email
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Estados del modal de verificación
//   const [showModal, setShowModal] = useState(false);
//   const [otpCode, setOtpCode] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [timer, setTimer] = useState(60);
//   const [canResend, setCanResend] = useState(false);

//   // Temporizador para reenvío
//   React.useEffect(() => {
//     if (showModal && timer > 0) {
//       const interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (timer === 0) {
//       setCanResend(true);
//     }
//   }, [timer, showModal]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) setError("");
//   };

//   const validateForm = () => {
//     if (
//       !formData.username ||
//       !formData.nombres ||
//       !formData.apellidos ||
//       !formData.email ||
//       !formData.contrasena ||
//       !formData.confirmarContrasena
//     ) {
//       setError("Todos los campos obligatorios deben ser completados");
//       return false;
//     }
//     if (formData.contrasena.length < 6) {
//       setError("La contraseña debe tener al menos 6 caracteres");
//       return false;
//     }
//     if (formData.contrasena !== formData.confirmarContrasena) {
//       setError("Las contraseñas no coinciden");
//       return false;
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError("Por favor ingresa un email válido");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://localhost:8500/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: formData.username,
//           nombres: formData.nombres,
//           apellidos: formData.apellidos,
//           email: formData.email,
//           telefono: formData.telefono || null,
//           contrasena: formData.contrasena,
//           metodo2FA: "email", // Siempre email
//         }),
//       });

//       // Leer la respuesta como texto primero
//       const responseText = await response.text();
//       console.log("Respuesta del servidor:", responseText);

//       if (!response.ok) {
//         throw new Error(responseText);
//       }

//       // Intentar parsear como JSON
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         // Si no es JSON, asumir que el registro fue exitoso
//         console.log("Respuesta no es JSON, asumiendo éxito");
//         data = { mensaje: responseText };
//       }

//       console.log("Datos parseados:", data);

//       // Guardar email para verificación
//       localStorage.setItem("emailPendiente", formData.email);
      
//       // Abrir modal de verificación
//       setShowModal(true);
//       setTimer(60);
//       setCanResend(false);

//     } catch (err) {
//       setError(err.message || "Error al registrar el usuario");
//       console.error("Error en registro:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otpCode || otpCode.length !== 6) {
//       setOtpError("El código debe tener 6 dígitos");
//       return;
//     }

//     setOtpLoading(true);
//     setOtpError("");
//     const email = localStorage.getItem("emailPendiente");

//     try {
//       const response = await fetch("http://localhost:8500/api/auth/verificar", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           identificador: email,
//           codigo: otpCode,
//           metodo: "email"
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.text();
//         throw new Error(errorData || "Código inválido o expirado");
//       }

//       // Verificación exitosa
//       localStorage.removeItem("emailPendiente");
//       setShowModal(false);
//       alert("✅ Cuenta verificada exitosamente");
      
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);

//     } catch (err) {
//       setOtpError(err.message || "Error al verificar el código");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     const email = localStorage.getItem("emailPendiente");
    
//     try {
//       const response = await fetch("http://localhost:8500/api/auth/reenviar-codigo", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           identificador: email,
//           metodo: "email"
//         })
//       });

//       if (!response.ok) {
//         throw new Error("Error al reenviar código");
//       }

//       alert("✅ Código reenviado a tu email");
//       setTimer(60);
//       setCanResend(false);
//       setOtpCode("");
//       setOtpError("");

//     } catch (err) {
//       setOtpError("Error al reenviar el código");
//     }
//   };

//   const handleOtpInputChange = (e) => {
//     const value = e.target.value.replace(/\D/g, ""); // Solo números
//     if (value.length <= 6) {
//       setOtpCode(value);
//       if (otpError) setOtpError("");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-white to-indigo-500">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
//         <div className="text-center mb-6">
//           <i className="bi bi-person-plus-fill text-indigo-600 text-5xl"></i>
//           <h3 className="mt-3 text-2xl font-bold text-gray-800">Crear Cuenta</h3>
//           <p className="text-gray-500 text-sm">Regístrate para comenzar</p>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             <i className="bi bi-exclamation-triangle-fill mr-2"></i>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Usuario */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Usuario
//             </label>
//             <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
//               <span className="px-3 bg-gray-100 text-gray-500">
//                 <i className="bi bi-person-fill"></i>
//               </span>
//               <input
//                 type="text"
//                 name="username"
//                 className="w-full px-3 py-2 outline-none text-gray-700"
//                 placeholder="Nombre de usuario"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {/* Nombres y apellidos */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Nombres
//               </label>
//               <input
//                 type="text"
//                 name="nombres"
//                 className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
//                 placeholder="Nombres"
//                 value={formData.nombres}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Apellidos
//               </label>
//               <input
//                 type="text"
//                 name="apellidos"
//                 className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
//                 placeholder="Apellidos"
//                 value={formData.apellidos}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Correo electrónico
//             </label>
//             <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
//               <span className="px-3 bg-gray-100 text-gray-500">
//                 <i className="bi bi-envelope-fill"></i>
//               </span>
//               <input
//                 type="email"
//                 name="email"
//                 className="w-full px-3 py-2 outline-none text-gray-700"
//                 placeholder="ejemplo@correo.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {/* Teléfono (opcional) */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Teléfono <span className="text-gray-400 text-xs">(opcional)</span>
//             </label>
//             <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
//               <span className="px-3 bg-gray-100 text-gray-500">
//                 <i className="bi bi-phone-fill"></i>
//               </span>
//               <input
//                 type="tel"
//                 name="telefono"
//                 className="w-full px-3 py-2 outline-none text-gray-700"
//                 placeholder="Número de teléfono"
//                 value={formData.telefono}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {/* Contraseña */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Contraseña
//             </label>
//             <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
//               <span className="px-3 bg-gray-100 text-gray-500">
//                 <i className="bi bi-key-fill"></i>
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="contrasena"
//                 className="w-full px-3 py-2 outline-none text-gray-700"
//                 placeholder="Mínimo 6 caracteres"
//                 value={formData.contrasena}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 className="px-3 text-gray-500 hover:text-gray-700 transition"
//                 onClick={() => setShowPassword(!showPassword)}
//                 disabled={loading}
//               >
//                 <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
//               </button>
//             </div>
//           </div>

//           {/* Confirmar Contraseña */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Confirmar Contraseña
//             </label>
//             <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
//               <span className="px-3 bg-gray-100 text-gray-500">
//                 <i className="bi bi-key-fill"></i>
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="confirmarContrasena"
//                 className="w-full px-3 py-2 outline-none text-gray-700"
//                 placeholder="Confirma tu contraseña"
//                 value={formData.confirmarContrasena}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {/* Info de verificación */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//             <p className="text-xs text-blue-700">
//               <i className="bi bi-info-circle-fill mr-1"></i>
//               Recibirás un código de verificación en tu email
//             </p>
//           </div>

//           {/* Botón */}
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed font-semibold"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Registrando...
//               </span>
//             ) : (
//               "Registrarse"
//             )}
//           </button>

//           <div className="text-center mt-4">
//             <p className="text-gray-600 text-sm">
//               ¿Ya tienes una cuenta?{" "}
//               <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
//                 Iniciar Sesión
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>

//       {/* 🔐 MODAL DE VERIFICACIÓN */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
//           <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
//             <div className="text-center mb-6">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
//                 <i className="bi bi-shield-check text-purple-600 text-3xl"></i>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Verificar Cuenta
//               </h2>
//               <p className="text-gray-600 text-sm">
//                 Ingresa el código de 6 dígitos enviado a:
//               </p>
//               <p className="text-purple-600 font-semibold mt-1 break-all text-sm">
//                 <i className="bi bi-envelope-fill mr-1"></i>
//                 {formData.email}
//               </p>
//             </div>

//             {otpError && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
//                 <i className="bi bi-exclamation-triangle-fill mr-2"></i>
//                 {otpError}
//               </div>
//             )}

//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
//                 Código de Verificación
//               </label>
//               <input
//                 type="text"
//                 value={otpCode}
//                 onChange={handleOtpInputChange}
//                 onKeyPress={(e) => e.key === "Enter" && otpCode.length === 6 && handleVerifyOtp()}
//                 maxLength="6"
//                 className="w-full text-center text-4xl font-bold tracking-widest px-4 py-4 border-2 border-purple-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
//                 placeholder="000000"
//                 autoFocus
//                 disabled={otpLoading}
//               />
//               <p className="text-xs text-gray-500 text-center mt-2">
//                 <i className="bi bi-clock mr-1"></i>
//                 El código expira en 5 minutos
//               </p>
//             </div>

//             <div className="space-y-3">
//               <button
//                 onClick={handleVerifyOtp}
//                 disabled={otpLoading || otpCode.length !== 6}
//                 className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-purple-300 disabled:cursor-not-allowed font-semibold"
//               >
//                 {otpLoading ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Verificando...
//                   </span>
//                 ) : (
//                   <>
//                     <i className="bi bi-check-circle mr-2"></i>
//                     Verificar Código
//                   </>
//                 )}
//               </button>

//               <div className="text-center">
//                 {canResend ? (
//                   <button
//                     onClick={handleResendCode}
//                     className="text-purple-600 hover:text-purple-800 font-semibold text-sm transition"
//                   >
//                     <i className="bi bi-arrow-clockwise mr-1"></i>
//                     Reenviar código
//                   </button>
//                 ) : (
//                   <p className="text-gray-500 text-sm">
//                     Reenviar código en {timer}s
//                   </p>
//                 )}
//               </div>

//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   setOtpCode("");
//                   setOtpError("");
//                 }}
//                 disabled={otpLoading}
//                 className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50 text-sm"
//               >
//                 Cancelar
//               </button>
//             </div>

//             <div className="mt-6 p-3 bg-purple-50 rounded-lg">
//               <p className="text-xs text-gray-600 text-center">
//                 <i className="bi bi-info-circle-fill text-purple-500 mr-1"></i>
//                 Si no recibiste el código, revisa tu carpeta de spam
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Signup;

import React, { useState } from 'react';

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    username: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8500/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          username: formData.username
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8500/api/auth/verificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('¡Cuenta verificada exitosamente! Redirigiendo...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8500/api/auth/reenviar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {step === 1 ? 'Crear Cuenta' : 'Verificar Código'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {step === 1 ? (



          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre de usuario"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-gray-400"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>



        ) : (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Hemos enviado un código de 6 dígitos a:
              </p>
              <p className="font-semibold text-gray-800 mt-2">{formData.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Verificación
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e, handleVerify)}
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-gray-400"
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>

            <div className="text-center">
              <button
                onClick={handleResendCode}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Volver al registro
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}