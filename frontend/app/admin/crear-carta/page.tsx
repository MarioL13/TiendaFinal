"use client";

import { useState } from "react";

export default function CrearCartaPage() {
  const [form, setForm] = useState({
    nombre: "",
    set_code: "",
    stock: 1,
    precio: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/cartas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre: form.nombre,
          set_code: form.set_code,
          stock: Number(form.stock),
          precio: Number(form.precio),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear carta");
      setSuccess("Carta creada correctamente: " + data.id);
      setForm({ nombre: "", set_code: "", stock: 1, precio: 1 });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center min-h-[70vh]">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
        Crear nueva carta
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col gap-6"
      >
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Nombre de la carta
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border-2 border-[#334139] focus:border-[#5D008F] focus:outline-none bg-white text-gray-900"
            placeholder="Ej: Lightning Bolt"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Código del set
          </label>
          <input
            type="text"
            name="set_code"
            value={form.set_code}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border-2 border-[#334139] focus:border-[#5D008F] focus:outline-none bg-white text-gray-900"
            placeholder="Ej: 2xm"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-gray-800">Stock</label>
            <input
              type="number"
              name="stock"
              min={0}
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border-2 border-[#334139] focus:border-[#5D008F] focus:outline-none bg-white text-gray-900"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-gray-800">
              Precio (€)
            </label>
            <input
              type="number"
              name="precio"
              min={0}
              step={0.01}
              value={form.precio}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border-2 border-[#334139] focus:border-[#5D008F] focus:outline-none bg-white text-gray-900"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-3 rounded-xl font-bold text-lg border-2 border-[#334139] bg-[#334139] text-[#FBFEF9] shadow-lg transition-all duration-200 hover:bg-[#FBFEF9] hover:text-[#334139] hover:border-[#5D008F] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creando..." : "Crear carta"}
        </button>
        {success && (
          <div className="text-green-700 font-semibold text-center">{success}</div>
        )}
        {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
      </form>
      <div className="mt-8 text-gray-600 text-sm max-w-lg text-center">
        <b>¿Cómo obtener el código de set?</b> Puedes buscar el código en{" "}
        <a
          href="https://scryfall.com/sets"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5D008F] underline"
        >
          Scryfall
        </a>
        .
        <br />
        Ejemplo: "2xm" para Double Masters, "khm" para Kaldheim, etc.
      </div>
    </div>
  );
}
