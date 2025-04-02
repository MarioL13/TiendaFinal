import express, { Request, Response } from 'express';
import cors from 'cors';
import usersRouter from './routes/usuarios'; // Importa las rutas
import productsRouter from './routes/productos';
import categoriasRouter from './routes/categorias'

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());  // Para poder recibir datos JSON en el cuerpo de las solicitudes

// Usar las rutas de usuarios
app.use(usersRouter);
app.use(productsRouter);
app.use(categoriasRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('API funcionando');
});

app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
