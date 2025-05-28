// components/Modal.tsx
'use client'

import { useRouter } from "next/router";

export default function Modal() {
    const router = useRouter();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Información</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-lg text-gray-500">¡Esta es la información que antes mostrabas con alert!</p>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
