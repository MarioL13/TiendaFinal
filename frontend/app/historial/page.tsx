"use client";
import React, { useEffect, useState } from "react";

interface Pedido {
  id_pedido: number;
  fecha_pedido: string;
  total: number;
  estado: string;
}

const HistorialPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5000/api/pedidos/mis_pedidos?page=${page}&limit=10`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("No se pudo cargar el historial de pedidos");
        const data = await res.json();
        setPedidos(data.pedidos);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || "Error al cargar el historial");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [page]);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8 border border-gray-200 mt-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Historial de pedidos</h2>
      {loading ? (
        <div className="text-center py-10 text-lg font-semibold">Cargando...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : pedidos.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No tienes pedidos registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-black px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-black px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="text-black px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-black px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidos.map((pedido) => (
                <tr key={pedido.id_pedido}>
                  <td className="px-4 py-2 font-semibold text-black">{pedido.id_pedido}</td>
                  <td className="px-4 py-2 text-black">{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                  <td className="px-4 py-2 text-black">{pedido.total} EUR</td>
                  <td className="px-4 py-2 text-black">
                    <span className="px-2 py-1 rounded text-xs font-bold "
                      style={{
                        background: pedido.estado === 'Pagado' ? '#bbf7d0' : pedido.estado === 'Pendiente' ? '#fef08a' : '#fca5a5',
                        color: pedido.estado === 'Pagado' ? '#166534' : pedido.estado === 'Pendiente' ? '#92400e' : '#991b1b',
                      }}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginación */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              className="text-white px-3 py-1 rounded bg-gray-900 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="text-black px-3 py-1">Página {page} de {totalPages}</span>
            <button
              className="text-white px-3 py-1 rounded bg-gray-900 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialPedidos;

