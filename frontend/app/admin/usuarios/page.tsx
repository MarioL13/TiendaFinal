"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  FOTO?: string | null;
}

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al cargar usuarios");
        setUsuarios(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar");
      setUsuarios(usuarios.filter(u => u.id_usuario !== id));
    } catch (err: any) {
      alert(err.message || "Error desconocido");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 animate-fade-in mt-20">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin" className="text-gray-600 hover:underline text-sm">← Volver al panel</Link>
          <h2 className="text-2xl font-bold text-purple-700">Gestión de usuarios</h2>
          <Link href="/admin/usuarios/crear" className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded shadow hover:from-green-600 hover:to-green-800 font-semibold">+ Crear usuario</Link>
        </div>
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-purple-100">
                <tr>
                  <th className="p-2">Foto</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Teléfono</th>
                  <th className="p-2">Dirección</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id_usuario} className="border-b hover:bg-purple-50 text-black">
                    <td className="p-2 text-center">
                      {usuario.FOTO ? (
                        <img src={usuario.FOTO} alt="Foto" className="w-10 h-10 rounded-full object-cover mx-auto" />
                      ) : (
                        <span className="inline-block w-10 h-10 rounded-full bg-gray-200" />
                      )}
                    </td>
                    <td className="p-2">{usuario.nombre} {usuario.apellido}</td>
                    <td className="p-2">{usuario.email}</td>
                    <td className="p-2">{usuario.telefono || '-'}</td>
                    <td className="p-2">{usuario.direccion || '-'}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        onClick={() => router.push(`/admin/usuarios/${usuario.id_usuario}/editar`)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold"
                      >Editar</button>
                      <button
                        onClick={() => handleEliminar(usuario.id_usuario)}
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold"
                      >Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
