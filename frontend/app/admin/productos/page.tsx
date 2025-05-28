'use client';
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react';
import ProductosAdmin from "@/components/ProductosAdmin";
export default function Tienda() {
    const [estado, setEstado] = useState<'cargando' | 'autorizado' | 'no-autorizado'>('cargando')

    useEffect(() => {
        const verificarAuth = async () => {
            try {
                const res = await fetch('https://tiendafinal-production-2d5f.up.railway.app/api/check-auth', {
                    method: 'GET',
                    credentials: 'include',
                })

                if (!res.ok) throw new Error()

                const data = await res.json()
                if (data.rol === 'admin') {
                    setEstado('autorizado')
                } else {
                    setEstado('no-autorizado')
                }
            } catch {
                setEstado('no-autorizado')
            }
        }

        verificarAuth()
    }, [])

    if (estado === 'cargando') return <p>Cargando...</p>
    if (estado === 'no-autorizado') return notFound()

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