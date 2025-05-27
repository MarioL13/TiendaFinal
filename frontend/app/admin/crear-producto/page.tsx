"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from 'next/navigation'

export default function CrearProducto() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("");
  const [imagenes, setImagenes] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [idioma, setIdioma] = useState("");
  const [estado, setEstado] = useState<'cargando' | 'autorizado' | 'no-autorizado'>('cargando')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("stock", stock);
      formData.append("idioma", idioma);
      // Backend espera un array de categorias, lo mandamos como JSON
      formData.append("categorias", JSON.stringify([categoria]));
      if (imagenes) {
        Array.from(imagenes).forEach((img) => {
          formData.append("imagenes", img);
        });
      }
      const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el producto");
      }
      setSuccess("Producto creado correctamente");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setCategoria("");
      setStock("");
      setIdioma("");
      setImagenes(null);
      setTimeout(() => router.push("/admin/productos"), 1500);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verificarAuth = async () => {
      try {
        const res = await fetch('https://tiendafinal-production-2d5f.up.railway.app/api/check-auth', {
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

  if (estado === 'cargando') return <p>Cargando...</p>
  if (estado === 'no-autorizado') return notFound()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg space-y-6 border border-gray-200 animate-fade-in mt-20"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Crear nuevo producto</h2>
        <div className="flex justify-between mb-2">
          <Link href="/admin" className="text-gray-600 hover:underline text-sm">← Volver al panel</Link>
          <Link href="/admin/productos" className="text-blue-600 hover:underline text-sm">← Volver a productos</Link>
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
          <label className="block font-semibold text-black">Descripción</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="block font-semibold text-black">Precio (€)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block font-semibold text-black">Stock</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={e => setStock(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Categoría</label>
          <input
            type="text"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            placeholder="Ej: Cartas, Accesorios, Sobres..."
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Idioma</label>
          <input
            type="text"
            value={idioma}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdioma(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            placeholder="Ej: Español, Inglés, ..."
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold text-black">Imágenes</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => setImagenes(e.target.files)}
            className="w-full border rounded px-3 py-2 text-black"
          />
          {imagenes && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from(imagenes).map((img, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-black">{img.name}</span>
              ))}
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
          {loading ? "Creando..." : "Crear producto"}
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
