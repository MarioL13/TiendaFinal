// src/services/db.ts
import mysql from 'mysql2';

// Crear la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT)
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
