import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import CompraService from "../services/CompraService";
import ProveedorService from "../services/ProveedorService";
import EmpleadoService from "../services/EmpleadoService";
import { 
  ArrowLeftIcon,
  TruckIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function CompraForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tema, idioma } = useTheme();
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [enviado, setEnviado] = useState(false);
  
  const [formData, setFormData] = useState({
    proveedor: { idProveedor: "" },
    empleado: { idEmpleado: "" },
    total: ""
  });

  // Traducciones
  const traducciones = {
    es: {
      tituloEditar: "Editar Compra",
      tituloCrear: "Registrar Nueva Compra",
      descripcionEditar: "Modifica los datos de la compra existente",
      descripcionCrear: "Completa la información para registrar una nueva compra",
      volver: "Volver a Compras",
      proveedor: "Proveedor",
      empleado: "Empleado Responsable",
      total: "Total de la Compra",
      cancelar: "Cancelar",
      guardar: "Guardar Cambios",
      registrar: "Registrar Compra",
      guardando: "Guardando...",
      informacionImportante: "Información importante",
      punto1: "La fecha de compra se registrará automáticamente al momento de guardar",
      punto2: "Asegúrate de que el proveedor esté registrado en el sistema",
      punto3: "Verifica que el empleado seleccionado tenga permisos para realizar compras",
      punto4: "El total debe incluir todos los costos asociados a la compra",
      seleccionarProveedor: "Seleccionar proveedor",
      seleccionarEmpleado: "Seleccionar empleado",
      errorCargar: "Error al cargar datos",
      errorGuardar: "Error al guardar la compra",
      exitoGuardar: "Compra guardada exitosamente",
      camposRequeridos: "Todos los campos son requeridos",
      formularioCompras: "Formulario de Compras"
    },
    en: {
      tituloEditar: "Edit Purchase",
      tituloCrear: "Register New Purchase",
      descripcionEditar: "Modify existing purchase data",
      descripcionCrear: "Complete the information to register a new purchase",
      volver: "Back to Purchases",
      proveedor: "Supplier",
      empleado: "Responsible Employee",
      total: "Purchase Total",
      cancelar: "Cancel",
      guardar: "Save Changes",
      registrar: "Register Purchase",
      guardando: "Saving...",
      informacionImportante: "Important information",
      punto1: "The purchase date will be automatically recorded when saving",
      punto2: "Make sure the supplier is registered in the system",
      punto3: "Verify that the selected employee has permissions to make purchases",
      punto4: "The total must include all costs associated with the purchase",
      seleccionarProveedor: "Select supplier",
      seleccionarEmpleado: "Select employee",
      errorCargar: "Error loading data",
      errorGuardar: "Error saving purchase",
      exitoGuardar: "Purchase saved successfully",
      camposRequeridos: "All fields are required",
      formularioCompras: "Purchase Form"
    }
  };

  const t = traducciones[idioma];

  const cargarDatos = async () => {
    try {
      const [proveedoresRes, empleadosRes] = await Promise.all([
        ProveedorService.getAllProveedores(),
        EmpleadoService.getAllEmpleados()
      ]);
      
      setProveedores(proveedoresRes.data);
      setEmpleados(empleadosRes.data);

      if (id) {
        const compraRes = await CompraService.getCompraById(id);
        setFormData(compraRes.data);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert(t.errorCargar);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id, idioma]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'proveedorId') {
      setFormData(prev => ({
        ...prev,
        proveedor: { idProveedor: parseInt(value) }
      }));
    } else if (name === 'empleadoId') {
      setFormData(prev => ({
        ...prev,
        empleado: { idEmpleado: parseInt(value) }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const compraData = {
        ...formData,
        total: parseFloat(formData.total)
      };

      if (id) {
        await CompraService.updateCompra(id, compraData);
      } else {
        await CompraService.createCompra(compraData);
      }
      
      setEnviado(true);
      setTimeout(() => {
        navigate("/compras");
      }, 1500);
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      alert(t.errorGuardar);
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = `min-h-screen transition-all duration-500 ${
    tema === 'oscuro' 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-900'
  }`;

  const cardClasses = `rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 ${
    tema === 'oscuro' 
      ? 'bg-slate-800/80 border border-slate-700' 
      : 'bg-white/80 border border-white'
  }`;

  const inputClasses = `w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
    tema === 'oscuro' 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600' 
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-blue-50'
  }`;

  if (enviado) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold text-green-500 mb-4">{t.exitoGuardar}</h2>
            <p className="text-lg">Redirigiendo a la lista de compras...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-down">
            <button
              onClick={() => navigate("/compras")}
              className={`flex items-center gap-3 mb-6 transition-all duration-300 transform hover:scale-105 ${
                tema === 'oscuro' ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
              }`}
            >
              <ArrowLeftIcon className="h-6 w-6" />
              <span className="font-semibold">{t.volver}</span>
            </button>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4">
                {id ? t.tituloEditar : t.tituloCrear}
              </h1>
              <p className={`text-xl ${tema === 'oscuro' ? 'text-slate-300' : 'text-slate-600'}`}>
                {id ? t.descripcionEditar : t.descripcionCrear}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2">
              <div className={`${cardClasses} p-8`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-cyan-500/20 rounded-2xl">
                    <CalendarIcon className="h-6 w-6 text-cyan-500" />
                  </div>
                  <h2 className="text-2xl font-semibold">{t.formularioCompras}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Proveedor */}
                  <div className="group">
                    <label className="flex items-center gap-3 text-lg font-medium mb-4">
                      <TruckIcon className="h-6 w-6 text-cyan-500" />
                      {t.proveedor}
                    </label>
                    <select
                      name="proveedorId"
                      value={formData.proveedor?.idProveedor || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    >
                      <option value="">{t.seleccionarProveedor}</option>
                      {proveedores.map((proveedor) => (
                        <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                          {proveedor.nombre} - {proveedor.contacto} ({proveedor.telefono})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Empleado */}
                  <div className="group">
                    <label className="flex items-center gap-3 text-lg font-medium mb-4">
                      <UserIcon className="h-6 w-6 text-purple-500" />
                      {t.empleado}
                    </label>
                    <select
                      name="empleadoId"
                      value={formData.empleado?.idEmpleado || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    >
                      <option value="">{t.seleccionarEmpleado}</option>
                      {empleados.map((empleado) => (
                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                          {empleado.user} ({empleado.username}) - {empleado.rol?.rol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total */}
                  <div className="group">
                    <label className="flex items-center gap-3 text-lg font-medium mb-4">
                      <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
                      {t.total}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-2xl text-slate-400">S/</span>
                      </div>
                      <input
                        type="number"
                        name="total"
                        value={formData.total}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={`${inputClasses} pl-12 text-2xl font-bold`}
                        required
                      />
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate("/compras")}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        tema === 'oscuro'
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                      disabled={loading}
                    >
                      {t.cancelar}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          {t.guardando}
                        </div>
                      ) : (
                        id ? t.guardar : t.registrar
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Información adicional */}
            <div className="lg:col-span-1">
              <div className={`${cardClasses} p-6 sticky top-6`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  {t.informacionImportante}
                </h3>
                <ul className={`space-y-3 text-sm ${
                  tema === 'oscuro' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{t.punto1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{t.punto2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{t.punto3}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{t.punto4}</span>
                  </li>
                </ul>

                <div className={`mt-6 p-4 rounded-xl border-2 ${
                  tema === 'oscuro' 
                    ? 'bg-cyan-500/10 border-cyan-500/30' 
                    : 'bg-cyan-50 border-cyan-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    tema === 'oscuro' ? 'text-cyan-300' : 'text-cyan-700'
                  }`}>
                    {t.camposRequeridos}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}