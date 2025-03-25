// frontend/app/home/page.tsx
'use client'; // Esto marca el archivo como un componente del lado del cliente

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

const Home = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Usuarios</h1>
            <ul>
                {users.map((user) => {
                    return (
                        <li key={user.id_usuario}>{user.email}</li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Home;
