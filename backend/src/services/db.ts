// src/services/db.ts
import mysql from 'mysql2';

// Crear la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendaonline'
});

// Verificar si la conexión se establece correctamente
db.connect((err: mysql.QueryError | null) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

export default db;
