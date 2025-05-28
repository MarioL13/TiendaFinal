'use client'; // Añade esto si estás usando App Router en Next.js y necesitas interacción con el componente.

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Evento {
  id_evento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  juego: string;
  precio_inscripcion?: number;
  premios?: string;
  aforo_maximo?: number;
  imagen?: string;
}

const EventosList: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/eventos");
        if (!res.ok) throw new Error("Error al cargar eventos");
        const data = await res.json();
        // Si backend devuelve {eventos: [...]} o solo array
        setEventos(Array.isArray(data) ? data : data.eventos || []);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  if (loading) return <div className="text-center p-8">Cargando eventos...</div>;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
      {eventos.map(evento => (
        <div key={evento.id_evento} className="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg mt-8 mx-auto">
          <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
            <Image
              src={evento.imagen || '/fondo2v2.png'}
              alt={evento.nombre}
              width={416}
              height={234}
              className="relative w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
          </div>
          <div className="p-6">
            <h5 className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900">
              {evento.nombre}
            </h5>
            <p className="block font-sans text-base antialiased font-light leading-relaxed text-gray-700">
              {evento.descripcion}
            </p>
            <div className="flex flex-col gap-1 mt-3 text-sm text-gray-700">
              <span><b>Fecha:</b> {new Date(evento.fecha).toLocaleString()}</span>
              <span><b>Juego:</b> {evento.juego}</span>
              {evento.precio_inscripcion !== undefined && <span><b>Precio inscripción:</b> €{evento.precio_inscripcion}</span>}
              {evento.aforo_maximo !== undefined && <span><b>Aforo máximo:</b> {evento.aforo_maximo}</span>}
              {evento.premios && <span><b>Premios:</b> {evento.premios}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventosList;