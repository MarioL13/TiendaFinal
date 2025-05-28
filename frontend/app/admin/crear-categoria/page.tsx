"use client"

import { useState } from "react"

export default function CrearCategoriaPage() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")
    try {
      const res = await fetch("http://localhost:5000/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error al crear categoría")
      setSuccess("Categoría creada correctamente: " + data.categoria.nombre)
      setForm({ nombre: "", descripcion: "" })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center min-h-[70vh]">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Crear nueva categoría</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col gap-6"
      >
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Nombre de la categoría</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border-2 border-[#334139] focus:border-[#5D008F] focus:outline-none bg-white text-gray-900"
            placeholder="Ej: Accesorios"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 rounded-lg border-2 border-[#334139] focus:border-[#5D008F] focus:outline-none bg-white text-gray-900 resize-none"
            placeholder="Describe la categoría"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-3 rounded-xl font-bold text-lg border-2 border-[#334139] bg-[#334139] text-[#FBFEF9] shadow-lg transition-all duration-200 hover:bg-[#FBFEF9] hover:text-[#334139] hover:border-[#5D008F] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creando..." : "Crear categoría"}
        </button>
        {success && <div className="text-green-700 font-semibold text-center">{success}</div>}
        {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
      </form>
    </div>
  )
}
