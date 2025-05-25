"use client";

import React, { useEffect, useState } from 'react';

const DeseadosPage = () => {
  const [deseados, setDeseados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Obtener el id del usuario autenticado
    const fetchUserId = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me', { credentials: 'include' });
        if (!res.ok) throw new Error('No autenticado');
        const data = await res.json();
        setUserId(data.id_usuario || data.id);
      } catch (err: any) {
        setError('Debes iniciar sesión para ver tu lista de deseados.');
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchDeseados = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/wishlist', { credentials: 'include' });
        if (!res.ok) throw new Error('No se pudo cargar la lista de deseados');
        const data = await res.json();
        setDeseados(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la lista de deseados');
      } finally {
        setLoading(false);
      }
    };
    fetchDeseados();
  }, [userId]);

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Cargando lista de deseados...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-md p-8 mt-30 mb-30">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Lista de Deseados</h2>
      
      {deseados.length === 0 ? (
        <p className="text-gray-500 text-lg">No tienes productos en tu lista de deseados.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {deseados.map((item) => (
            <li key={item.id_deseado} className="flex flex-col md:flex-row items-center py-4 gap-4 md:gap-0">
              <div className="w-32 flex flex-col items-center justify-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gray-50 border rounded-lg overflow-hidden">
                  {item.imagen ? (
                    <img src={item.imagen.startsWith('http') ? item.imagen : `/uploads/${item.imagen}`} alt={item.nombre || 'Producto'} className="object-contain w-full h-full" />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full">
                <div>
                  <div className="font-semibold text-lg text-gray-800 cursor-pointer hover:underline"
                    onClick={() => {
                      if (item.id_producto) {
                        window.location.href = `/productos/${item.id_producto}`;
                      } else if (item.id_carta) {
                        window.location.href = `/cartas/${item.id_carta}`;
                      }
                    }}
                  >
                    {item.nombre || `ID: ${item.id_producto || item.id_carta}`}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">ID: {item.id_producto || item.id_carta}</div>
                </div>
                <button
                  className="mt-4 md:mt-0 font-bold py-2 px-4 rounded-lg transition-colors border-2 text-lg"
                  style={{ background: '#F87171', color: '#fff', border: '2px solid #B91C1C' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#B91C1C';
                    e.currentTarget.style.border = '2px solid #F87171';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#F87171';
                    e.currentTarget.style.border = '2px solid #B91C1C';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onClick={async () => {
                    try {
                      const res = await fetch(`http://localhost:5000/api/wishlist/${item.id_deseado}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      });
                      if (!res.ok) throw new Error('No se pudo eliminar el deseado');
                      setDeseados(deseados.filter(d => d.id_deseado !== item.id_deseado));
                    } catch (err) {
                      alert('Error al eliminar el deseado');
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeseadosPage;