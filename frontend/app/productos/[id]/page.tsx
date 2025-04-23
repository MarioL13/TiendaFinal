"use client";
import ProductCard from "@/components/Producto";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Producto {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria?: {
    nombre: string;
  };
}

export default function Page() {
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  console.log('ID de producto:', id);
  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("ID de producto inválido.");
      setLoading(false);
      console.log('Producto cargado:', producto);
      return;
    }

    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        console.log('Respuesta del servidor:', response);
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
    <>
      <ProductCard
        title={producto.nombre}
        descripcion={producto.descripcion}
        price={`${producto.precio}€`}
        image={producto.imagen}
      />
      <button className="button">Comprar</button>
    </>   
  );
}  