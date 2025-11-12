import { useEffect, useState } from "react";
import ModalProducto from "../components/ModalProducto";
import ModalCategoria from "../components/ModalCategoria";
import { PencilIcon, TrashIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [isProductoOpen, setProductoOpen] = useState(false);
  const [isCategoriaOpen, setCategoriaOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { authFetch } = useAuth();

  const porPagina = 10;

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await authFetch("http://localhost:8500/api/productos");
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProductos(data);
      setError("");
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudo obtener la lista de productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const res = await authFetch(`http://localhost:8500/api/productos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar producto");
      cargarProductos();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el producto.");
    }
  };

  const cambiarEstado = async (p) => {
    try {
      const res = await authFetch(`http://localhost:8500/api/productos/estado/${p.idProducto}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Error al cambiar estado del producto");
      cargarProductos();
    } catch (err) {
      console.error(err);
      alert("No se pudo cambiar el estado del producto.");
    }
  };

  const productosPaginados = productos.slice((pagina - 1) * porPagina, pagina * porPagina);
  const totalPaginas = Math.ceil(productos.length / porPagina);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Productos</h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setProductoEditar(null); setProductoOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-indi-700 transition"
        > Nuevo Producto </button>

        <button
          onClick={() => setCategoriaOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        > Nueva Categoría </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-800 border">
            <tr>
              {["ID","Producto","Categoría","Talla","Color","Género","P. Venta","Stock","Estado","Imagen","Acciones"]
                .map(h => <th key={h} className="p-3 border font-medium">{h}</th>)}
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr key={p.idProducto} className="hover:bg-gray-50 transition">
                <td className="p-2 border text-center">{p.idProducto}</td>
                <td className="p-2 border">{p.producto}</td>
                <td className="p-2 border">{p.categoria?.categoria}</td>
                <td className="p-2 border">{p.talla}</td>
                <td className="p-2 border">{p.color}</td>
                <td className="p-2 border">{p.genero ? "Masculino" : "Femenino"}</td>
                <td className="p-2 border font-semibold">S/. {p.precioVenta}</td>
                <td className="p-2 border text-center">{p.stock}</td>

                <td className="p-2 border text-center">
                  <span className={`px-2 py-1 rounded text-white text-xs ${p.estado ? "bg-green-600" : "bg-red-600"}`}>
                    {p.estado ? "Disponible" : "No Disponible"}
                  </span>
                </td>

                <td className="p-2 border text-center">
                  {p.imagen && <img src={`http://localhost:8500${p.imagen}`} alt="" className="h-14 w-14 object-cover rounded" />}
                </td>

                <td className="p-2 border flex gap-2 justify-center">
                <button onClick={() => { setProductoEditar(p); setProductoOpen(true); }}>
                  <PencilIcon className="h-5 text-blue-600 cursor-pointer" />
                </button>

                <button onClick={() => eliminarProducto(p.idProducto)}>
                  <TrashIcon className="h-5 text-red-600 cursor-pointer" />
                </button>

                <button onClick={() => cambiarEstado(p.idProducto)}>
                  <ArrowsRightLeftIcon className="h-5 text-yellow-600 cursor-pointer" />
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>   
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center mt-4 gap-2">
        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPagina(i + 1)}
            className={`px-3 py-1 border rounded ${pagina === i + 1 ? "bg-indigo-600 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>   
      <ModalProducto isOpen={isProductoOpen} onClose={() => { setProductoOpen(false); cargarProductos(); }} productoEditar={productoEditar} />

      <ModalCategoria isOpen={isCategoriaOpen} onClose={() => setCategoriaOpen(false)} />
    </div>
  );
}