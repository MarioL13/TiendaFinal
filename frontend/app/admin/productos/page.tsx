'use client';
import ProductosAdmin from "@/components/ProductosAdmin";
export default function Tienda() {
    return (
        <div className="space-y-10">
            {/* Carrusel de imágenes */}
            <section className="w-full">

            </section>
            {/* Productos destacados */}
            <section className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Productos Destacados</h2>
                <ProductosAdmin />
            </section>
        </div>
    );
}