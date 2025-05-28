import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import usersRouter from './routes/usuarios'; // Importa las rutas
import productsRouter from './routes/productos';
import categoriasRouter from './routes/categorias';
import deseadosRouter from './routes/deseados';
import cartasRouter from './routes/cartas';
import carritoRouter from './routes/carrito';
import pedidosRouter from './routes/pedidos';
import eventosRouter from './routes/eventos';

import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
const port = 5000;

const allowedOrigins = [
    'https://rinconfriki-production.up.railway.app',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());  // Para poder recibir datos JSON en el cuerpo de las solicitudes

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Rutas

// Usar las rutas de usuarios
app.use(usersRouter);
app.use(productsRouter);
app.use(categoriasRouter);
app.use(cartasRouter);
app.use(deseadosRouter);
app.use(carritoRouter);
app.use(pedidosRouter);
app.use(eventosRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('API funcionando');
});

app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
