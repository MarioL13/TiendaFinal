"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  FOTO?: string | null;
}

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchUsuario = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://tiendafinal-production-2d5f.up.railway.app/api/users/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al cargar usuario");
        setUsuario(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !id) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("nombre", usuario.nombre);
      formData.append("apellido", usuario.apellido);
      formData.append("email", usuario.email);
      formData.append("telefono", usuario.telefono || "");
      formData.append("direccion", usuario.direccion || "");
      if (foto) {
        formData.append("FOTO", foto);
      }
      const res = await fetch(`https://tiendafinal-production-2d5f.up.railway.app/api/users/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar usuario");
      setSuccess("Usuario actualizado correctamente");
      setTimeout(() => router.push("/admin/usuarios"), 1200);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!usuario) return null;

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 py-8">
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg space-y-6 border border-gray-200 animate-fade-in"
            encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Editar usuario</h2>
          <div className="flex justify-between mb-2">
            <Link href="/admin" className="text-gray-600 hover:underline text-sm">← Volver al panel</Link>
            <Link href="/admin/usuarios" className="text-blue-600 hover:underline text-sm">← Volver a usuarios</Link>
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-black">Nombre</label>
            <input
                type="text"
                value={usuario.nombre}
                onChange={e => setUsuario({ ...usuario, nombre: e.target.value })}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-black">Apellido</label>
            <input
                type="text"
                value={usuario.apellido}
                onChange={e => setUsuario({ ...usuario, apellido: e.target.value })}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-black">Email</label>
            <input
                type="email"
                value={usuario.email}
                onChange={e => setUsuario({ ...usuario, email: e.target.value })}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-black">Teléfono</label>
            <input
                type="tel"
                value={usuario.telefono || ""}
                onChange={e => setUsuario({ ...usuario, telefono: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
                placeholder="Opcional"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-black">Dirección</label>
            <input
                type="text"
                value={usuario.direccion || ""}
                onChange={e => setUsuario({ ...usuario, direccion: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
                placeholder="Opcional"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-black">Foto</label>
            <input
                type="file"
                accept="image/*"
                onChange={e => setFoto(e.target.files ? e.target.files[0] : null)}
                className="w-full border rounded px-3 py-2 text-black"
            />
            {(foto || usuario.FOTO) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {foto ? (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-black">{foto.name}</span>
                  ) : usuario.FOTO ? (
                      <img src={usuario.FOTO} alt="Foto" className="w-12 h-12 rounded-full object-cover" />
                  ) : null}
                </div>
            )}
          </div>
          {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
          {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
          <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 rounded shadow hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
  );
}