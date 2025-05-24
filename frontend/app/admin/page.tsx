'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

export default function AdminPage() {
    const [estado, setEstado] = useState<'cargando' | 'autorizado' | 'no-autorizado'>('cargando')

    useEffect(() => {
        const verificarAuth = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/check-auth', {
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

    // Solo se llega aquí si está autorizado
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
            <ul className="space-y-2">
                <li>
                    <a href="/admin/productos" className="text-blue-600 hover:underline">
                        Gestión de productos
                    </a>
                </li>
            </ul>
        </div>
    )
}