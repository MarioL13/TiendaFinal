"use client";

import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Producto {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categorias?: string[];
}

export default function Page() {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("ID de producto inválido.");
      setLoading(false);
      return;
    }

    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
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
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <div className="p-4">
      <ProductCard
        productId={Number(id)}
        productData={{
          name: producto.nombre,
          description: producto.descripcion,
          price: producto.precio,
          image: producto.imagen,
        }}
      />
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Comprar
      </button>
    </div>
  );
}