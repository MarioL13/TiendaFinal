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

      const res = await fetch("http://localhost:5000/api/cartas/buscar-por-nombre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombres: nombresFormateados }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al buscar cartas");
      }
      setCartas(data.encontradas || []);
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

  const handleAddToCart = async (carta: any) => {
    try {
      const res = await fetch('http://localhost:5000/api/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          tipo_item: 'carta',
          id_item: carta.id_carta || carta.id_item || carta.id, 
          cantidad: 1
        })
      });
      if (res.ok) {
        alert('¡Carta añadida al carrito!');
      } else {
        const data = await res.json();
        alert(data.message || 'Error al añadir al carrito');
      }
    } catch (error) {
      alert('Error al añadir al carrito');
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
                <div style={{ width: 88, height: 122, position: 'relative', flexShrink: 0 }}>
                  {carta.imagen ? (
                    <img
                      src={carta.imagen.startsWith('http') ? carta.imagen : `/uploads/${carta.imagen}`}
                      alt={carta.nombre}
                      width={88}
                      height={122}
                      className="object-cover rounded border bg-white"
                      style={{ display: 'block' }}
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.querySelector('.placeholder')?.setAttribute('style', 'display:flex;width:88px;height:122px;align-items:center;justify-content:center;background:#e5e7eb;border-radius:8px;border:1px solid #ccc;color:#6b7280;font-size:12px;');
                      }}
                    />
                  ) : (
                    <span className="text-gray-400 placeholder flex items-center justify-center bg-gray-200 rounded border text-xs" style={{ width: 88, height: 122 }}>
                      Sin imagen
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-black">{carta.nombre}</div>
                  <div className="text-sm text-gray-700">Set: {carta.set_code} | Stock: {carta.stock} | Precio: €{carta.precio}</div>
                </div>
                <button
                  className="bg-[#334139] text-[#FBFEF9] border-2 border-[#334139] hover:bg-[#FBFEF9] hover:text-[#334139] hover:border-[#5D008F] font-bold py-2 px-4 rounded-lg transition-colors"
                  onClick={() => handleAddToCart(carta)}
                >
                  Comprar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
