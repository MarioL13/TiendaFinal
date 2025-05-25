"use client";

import { notFound } from 'next/navigation'
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Pedido {
  id_pedido: number;
  id_usuario: number;
  total: number;
  estado: string;
  fecha_pedido: string;
}

const estados = ["Pendiente", "Pagado", "Entregado", "Cancelado"];

export default function GestionPedidosPage() {
  const router = useRouter();

  const [estado, setEstado] = useState<'cargando' | 'autorizado' | 'no-autorizado'>('cargando')
  // Verificar si el usuario es admin al cargar la página
  useEffect(() => {
    const verificarAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (data.rol === 'admin') {
          setEstado('autorizado')
        } else {
          setEstado('no-autorizado')
        }
      } catch {
        setEstado('no-autorizado')
      }
    }
    verificarAuth()
  }, [])

  useEffect(() => {
    if (estado === 'no-autorizado') {
      router.push('/Login');
    }
  }, [estado, router]);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [success, setSuccess] = useState("");  const fetchPedidos = async () => {
    setLoading(true);
    setError("");
    try {
      // Primero verificamos si seguimos teniendo permisos
      const authCheck = await fetch('http://localhost:5000/api/check-auth', {
        credentials: 'include'
      });
      const authData = await authCheck.json();
      
      if (!authCheck.ok || !authData.autenticado || authData.rol !== 'admin') {
        router.push('/Login');
        throw new Error('No tienes permisos de administrador');
      }

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(estadoFiltro && { estado: estadoFiltro }),
        ...(fechaInicio && { fecha_inicio: fechaInicio }),
        ...(fechaFin && { fecha_fin: fechaFin }),
      });
      
      const res = await fetch(`http://localhost:5000/api/pedidos?${params.toString()}`, {
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/Login';
        throw new Error('No tienes permiso para ver esta página');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Error al cargar pedidos");
      
      if (!data.pedidos) {
        throw new Error('No se recibieron datos de pedidos');
      }
      
      setPedidos(data.pedidos);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
    // eslint-disable-next-line
  }, [page, estadoFiltro, fechaInicio, fechaFin]);

  const handleEstado = async (id_pedido: number, nuevoEstado: string) => {
    setActualizando(id_pedido);
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/pedidos/${id_pedido}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevoEstado }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar estado");
      setSuccess("Estado actualizado");
      fetchPedidos();
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setActualizando(null);
    }
  };

  if (estado === 'cargando') return <p>Cargando...</p>
  if (estado === 'no-autorizado') return notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin" className="text-gray-600 hover:underline text-sm">← Volver al panel</Link>
          <h2 className="text-2xl font-bold text-purple-700">Gestión de pedidos</h2>
        </div>
        <form className="flex flex-wrap gap-4 mb-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1">Estado</label>
            <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Todos</option>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Fecha inicio</label>
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Fecha fin</label>
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <button type="button" onClick={() => { setPage(1); fetchPedidos(); }} className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-700">Filtrar</button>
        </form>
        {success && <div className="text-green-600 text-center mb-2">{success}</div>}
        {error && <div className="text-red-600 text-center mb-2">{error}</div>}
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-purple-100">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Usuario</th>
                  <th className="p-2">Total (€)</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p.id_pedido} className="border-b hover:bg-purple-50">
                    <td className="p-2 text-center">{p.id_pedido}</td>
                    <td className="p-2 text-center">{p.id_usuario}</td>
                    <td className="p-2 text-center">{Number(p.total).toFixed(2)}</td>
                    <td className="p-2 text-center">
                      <select
                        value={p.estado}
                        onChange={e => handleEstado(p.id_pedido, e.target.value)}
                        disabled={actualizando === p.id_pedido}
                        className="border rounded px-2 py-1 bg-white"
                      >
                        {estados.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </td>
                    <td className="p-2 text-center">{new Date(p.fecha_pedido).toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <Link href={`/admin/pedidos/${p.id_pedido}`} className="text-blue-600 hover:underline">Ver detalles</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Anterior</button>
          <span className="px-2">Página {page} de {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
}
