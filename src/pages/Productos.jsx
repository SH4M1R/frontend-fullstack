import { useEffect, useState } from "react";
import ModalProducto from "../components/ModalProducto";
import ModalCategoria from "../components/ModalCategoria";
import { PencilIcon, TrashIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [isProductoOpen, setProductoOpen] = useState(false);
  const [isCategoriaOpen, setCategoriaOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const cargarProductos = async () => {
    const res = await fetch("http://localhost:8500/api/productos");
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    await fetch(`http://localhost:8500/api/productos/${id}`, { method: "DELETE" });
    cargarProductos();
  };

  const cambiarEstado = async (p) => {
    await fetch(`http://localhost:8500/api/productos/estado/${p.idProducto}`, { method: "PUT" });
    cargarProductos();
  };

  const productosPaginados = productos.slice((pagina - 1) * porPagina, pagina * porPagina);
  const totalPaginas = Math.ceil(productos.length / porPagina);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Productos</h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setProductoEditar(null); setProductoOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
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