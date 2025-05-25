'use client';

import Carousel from "@/components/Carousel";
import Destacados from "@/components/descados";
import Eventos from "@/components/Eventos";

export default function Main() { 
  return (
    <div className="space-y-10">
      {/* Carrusel de imágenes */}
      <section className="w-full">
        <Carousel />
      </section>

      {/* Productos destacados */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Productos Destacados</h2>
        <Destacados />
      </section>
      {/* Productos destacados */}
      <section className="container mx-auto px-4 d-flex">
        <h2 className="text-2xl font-bold mb-6 text-center">Eventos</h2>
        <Eventos />
      </section>
    </div>
  );
}
