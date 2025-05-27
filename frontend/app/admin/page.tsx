'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

export default function AdminPage() {
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

    // Solo se llega aquí si está autorizado
    return (
        <div className="container mx-auto p-4 flex flex-col items-center min-h-[70vh]">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Panel de Administración</h1>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Gestión de stock</h2>
                <div className="grid grid-cols-1 gap-6 w-full">
                    <a
                        href="/admin/productos"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Gestión de productos
                    </a>
                    <a
                        href="/admin/crear-producto"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Creación de productos
                    </a>
                    <a
                        href="/admin/pedidos"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 10h8M8 14h6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Gestión de pedidos
                    </a>
                    <a
                        href="/admin/usuarios"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Gestión de usuarios
                    </a>
                </div>
            </div>
        </div>
    )
}