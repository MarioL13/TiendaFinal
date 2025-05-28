"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CrearUsuario() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("apellido", apellido);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("telefono", telefono);
      formData.append("direccion", direccion);
      if (foto) {
        formData.append("foto", foto);
      }
      const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/users", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear el usuario");
      setSuccess("Usuario creado correctamente");
      setNombre("");
      setApellido("");
      setEmail("");
      setPassword("");
      setTelefono("");
      setDireccion("");
      setFoto(null);
      setTimeout(() => router.push("/admin/usuarios"), 1500);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg space-y-6 border border-gray-200 animate-fade-in mt-20"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Crear nuevo usuario</h2>
        <div className="flex justify-between mb-2">
          <Link href="/admin" className="text-gray-600 hover:underline text-sm">← Volver al panel</Link>
          <Link href="/admin/usuarios" className="text-blue-600 hover:underline text-sm">← Volver a usuarios</Link>
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            placeholder="Mínimo 8 caracteres, mayúscula, número y símbolo"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            placeholder="Opcional"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
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
          {foto && (
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-black">{foto.name}</span>
            </div>
          )}
        </div>
        {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
        {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 rounded shadow hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear usuario"}
        </button>
      </form>
    </div>
  );
}

// Animación fade-in para el formulario
// Agrega esto a tu CSS global si usas Tailwind:
// @layer utilities {
//   .animate-fade-in {
//     animation: fadeIn 0.7s ease;
//   }
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(30px); }
//     to { opacity: 1; transform: none; }
//   }
// }
