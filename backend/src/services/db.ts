import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT),
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
    } else {
        console.log('✅ Conectado a la base de datos');
    }
});

export default db;
