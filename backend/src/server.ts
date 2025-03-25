import express, { Request, Response } from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendaonline'
});

// @ts-ignore
db.connect((err: Error) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

interface User {
    id_usuario: number;
    nombre: string;
    FOTO: string;
    email: string;
    password: string;
    direccion: string;
    telefono: string;
    fecha_registro: string;
}

// backend/server.ts
app.get('/api/users', (req: Request, res: Response) => {
    db.query('SELECT * FROM usuarios', (err: Error, results: User[]) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
        } else {
            res.json(results);
        }
    });
});



app.get('/', (req: Request, res: Response) => {
    res.send('API funcionando');
});


app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
