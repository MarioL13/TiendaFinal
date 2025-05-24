'use client';
import Productos from "@/components/Productos";
export default function Tienda() { 
  return (
    <div className="space-y-10">
      {/* Carrusel de imágenes */}
      <section className="w-full">

      </section>
      {/* Productos destacados */}
      <section className="container mx-auto px-4 pt-10">
        <Productos />
      </section>
    </div>
  );
}