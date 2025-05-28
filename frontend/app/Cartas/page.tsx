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
      const nombresFormateados = nombres
          .split(/\n|,/)
          .map(n => n.trim())
          .filter(n => n.length > 0)
          .join(', ');

      const res = await fetch("https://rinconfriki-production.up.railway.app/api/cartas/buscar-por-nombre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombres: nombresFormateados }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al buscar cartas");
      }
      setCartas(data.encontradas || []);
      // Mostrar mensaje de cartas no encontradas de forma visible pero no como error bloqueante
      if (data.mensaje && data.mensaje.includes('no encontradas')) {
        setError(data.mensaje);
      } else {
        setError("");
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded shadow mt-20">
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
                {/* Imagen o placeholder siempre ocupan el mismo espacio */}
                <div style={{ width: 88, height: 122, position: 'relative', flexShrink: 0 }}>
                  {carta.imagen && typeof carta.imagen === 'string' && carta.imagen.startsWith('http') ? (
                    <img
                      src={carta.imagen}
                      alt={carta.nombre}
                      width={88}
                      height={122}
                      style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc', background: '#fff', display: 'block' }}
                      loading="lazy"
                      onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.querySelector('.placeholder')?.setAttribute('style', 'display:flex;width:88px;height:122px;align-items:center;justify-content:center;background:#e5e7eb;border-radius:8px;border:1px solid #ccc;color:#6b7280;font-size:12px;'); }}
                    />
                  ) : null}
                  <div
                    className="placeholder flex items-center justify-center bg-gray-200 rounded border text-xs text-gray-500"
                    style={{ width: 88, height: 122, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: (!carta.imagen || typeof carta.imagen !== 'string' || !carta.imagen.startsWith('http')) ? 'flex' : 'none' }}
                  >
                    Sin imagen
                  </div>
                </div>
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
