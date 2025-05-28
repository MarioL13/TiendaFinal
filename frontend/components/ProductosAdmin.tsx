"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    idiomas: string[];
    categorias: string[];
    imagenes: string[];
}

export default function ListaProductos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [estado, setEstado] = useState<"cargando" | "autorizado" | "no-autorizado">("cargando");

    const router = useRouter();

    useEffect(() => {
        const verificarAuth = async () => {
            try {
                const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/check-auth", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (data.rol === "admin") {
                    setEstado("autorizado");
                } else {
                    setEstado("no-autorizado");
                }
            } catch {
                setEstado("no-autorizado");
            }
        };

        verificarAuth();
    }, []);

    useEffect(() => {
        if (estado !== "autorizado") return;

        const fetchProductos = async () => {
            try {
                const res = await fetch("https://tiendafinal-production-2d5f.up.railway.app/api/products");
                if (!res.ok) throw new Error("Error al cargar productos");
                const data = await res.json();
                setProductos(data);
            } catch (err: any) {
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [estado]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

        try {
            const res = await fetch(`https://tiendafinal-production-2d5f.up.railway.app/api/products/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Error al eliminar el producto");
            }

            setProductos((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            const msg = err.message || "Error desconocido";
            alert(`No se pudo eliminar el producto:\n${msg}`);
            if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
                router.push("/admin");
            }
        }
    };

    if (estado === "cargando") return <p className="text-center mt-10 text-gray-600">Cargando...</p>;
    if (estado === "no-autorizado") return notFound();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-700">Gestión de Productos</h1>
                <Link
                    href="/admin/productos/crear"
                    className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition"
                >
                    + Crear nuevo producto
                </Link>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {loading ? (
                <p className="text-center">Cargando productos...</p>
            ) : productos.length === 0 ? (
                <p className="text-center text-gray-500">No hay productos registrados.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productos.map((producto) => (
                        <div
                            key={producto.id}
                            className="bg-white rounded shadow p-4 border border-gray-200 flex flex-col justify-between"
                        >
                            <div>
                                {producto.imagenes?.[0] && (
                                    <img
                                        src={producto.imagenes[0]}
                                        alt={producto.nombre}
                                        className="w-full h-40 object-cover mb-2 rounded"
                                    />
                                )}
                                <h2 className="text-xl font-bold text-purple-700">{producto.nombre}</h2>
                                <p className="text-gray-700 mt-1">Precio: {producto.precio} €</p>
                                <p className="text-gray-700">Stock: {producto.stock}</p>
                                <p className="text-gray-600 text-sm mt-1">Idiomas: {producto.idiomas.join(", ")}</p>
                                <p className="text-gray-600 text-sm">Categorías: {producto.categorias.join(", ")}</p>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <Link
                                    href={`/admin/productos/editar/${producto.id}`}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(producto.id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
