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

router.get('/api/cartas/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try{
        const carta = await obtenerCartaPorId(id);
        if (carta){
            res.json(carta);
        } else{
            res.status(404).json({ message: 'Carta no encontrada'})
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener la carta', error: err.message})
    }
});

router.post('/api/cartas', async (req: Request, res: Response) => {
    const carta = req.body;

    try{
        const result = await crearCarta(carta);
        res.status(201).json({ message: 'Carta creada', id: result.insertId});
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear carta', error: err.message})
    }
})

router.put('/api/cartas/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const carta = req.body;
    try{
        const result = await actualizarCarta(id, carta);
        if (result.affectedRows > 0) {
            res.json({ message: 'Carta actualizada'})
        }else {
            res.status(404).json({ message: 'Carta no encontrada'})
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar carta', error: err.message})
    }
})

router.delete('/api/cartas/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await eliminarCarta(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Carta eliminada'});
        } else {
            res.status(404).json({ message: 'Carta no encontrada'})
        }
    }catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar la carta', error: err.message})
    }
})

export default router;