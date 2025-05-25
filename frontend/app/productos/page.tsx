"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Producto {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria?: {
    nombre: string;
  };
}

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      setError("ID de producto inválido.");
      setLoading(false);
      return;
    }

    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/producto/${id}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado o error en el servidor.");
        }
        const data = await response.json();
        setProducto(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [searchParams]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
      <div className="p-4">
        <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Regresar
        </button>
        <h1 className="text-2xl font-bold">{producto.nombre}</h1>
        <p className="text-gray-700">{producto.descripcion}</p>
        <p className="text-xl font-semibold">${producto.precio}</p>
        {producto.categoria && (
            <p className="text-sm text-gray-500">Categoría: {producto.categoria.nombre}</p>
        )}
      </div>
  );
}