'use client';

import { useEffect, useState } from 'react';

interface User {
    id_usuario: number;
    nombre: string;
    email: string;
    foto: string;
    direccion: string;
    telefono: string;
    fecha_registro: string;
}

export default function Page() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Usuarios</h1>
            <ul className="list-disc pl-6">
                {users.map((user) => (
                    <li key={user.id_usuario} className="mb-2">
                        <span className="font-semibold">{user.nombre}:</span> {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};
