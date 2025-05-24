"use client";
import { useState } from "react";

export default function BuscarCartasPorNombrePage() {
  const [nombres, setNombres] = useState("");
  const [cartas, setCartas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCartas([]);
    setLoading(true);
    try {
      // Separa por salto de línea o coma
      const lista = nombres
        .split(/\n|,/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      const res = await fetch("http://localhost:5000/api/cartas/buscar-por-nombre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombres: lista }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al buscar cartas");
      }
      const data = await res.json();
      setCartas(data.cartas || []);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: 'black' }}>Buscar cartas por nombre</h2>
      <form onSubmit={handleBuscar} className="space-y-4 mb-6">
        <label className="block font-semibold text-black mb-1">
          Lista de nombres (uno por línea o separados por coma):
        </label>
        <textarea
          value={nombres}
          onChange={e => setNombres(e.target.value)}
          rows={5}
          className="w-full border rounded p-2 text-black bg-gray-50"
          placeholder="Ejemplo:\nBlack Lotus\nLightning Bolt\n..."
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar cartas"}
        </button>
      </form>
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}
      {cartas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">Resultados:</h3>
          <ul className="divide-y divide-gray-200">
            {cartas.map((carta, i) => (
              <li key={i} className="py-3 flex items-center gap-4">
                {carta.imagen && (
                  <img src={carta.imagen} alt={carta.nombre} className="w-16 h-22 object-cover rounded border" />
                )}
                <div>
                  <div className="font-bold text-black">{carta.nombre}</div>
                  <div className="text-sm text-gray-700">Set: {carta.set_code} | Stock: {carta.stock} | Precio: €{carta.precio}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
