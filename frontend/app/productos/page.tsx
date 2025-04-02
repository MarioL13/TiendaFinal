'use client'; // Solo necesario si utilizas cosas como useState o efectos en cliente

import Producto from "@/components/Producto";

export default function Home() {
    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Productos</h1>
            <Producto/>
        </div>
    );
}
