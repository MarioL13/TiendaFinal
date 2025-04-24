import { Router, Request, Response } from 'express';
import {
    obtenerCartas,
    obtenerCartaPorId,
    crearCarta,
    actualizarCarta,
    eliminarCarta
} from '../services/cartasServices';

const router = Router();

router.get('/api/cartas', async (Request, res: Response) => {
    try {
        const cartas = await obtenerCartas();
        res.json(cartas);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las cartas', error: err.message})
    }
})

export default router;