import { Router, Request, Response } from 'express';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware';
import {
    obtenerEventos,
    obtenerEventoPorId,
    crearEvento,
    actualizarEvento,
    eliminarEvento
} from '../services/eventosServices';

const router = Router();

// GET: Obtener todos los eventos con filtros opcionales
router.get('/api/eventos', async (req: Request, res: Response) => {
    const { fecha, juego, nombre } = req.query;

    try {
        const eventos = await obtenerEventos({
            fecha: fecha as string,
            juego: juego as string,
            nombre: nombre as string
        });
        res.json(eventos);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los eventos', error: err.message });
    }
});

// GET: Obtener evento por ID
router.get('/api/eventos/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de evento inválido' });
    }

    try {
        const evento = await obtenerEventoPorId(id);
        if (evento) {
            res.json(evento);
        } else {
            res.status(404).json({ error: 'Evento no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el evento', error: err.message });
    }
});

// POST: Crear nuevo evento
router.post('/api/eventos', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const evento = req.body;

    const error = validarEvento(evento);
    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const result = await crearEvento(evento);
        res.status(201).json({ message: 'Evento creado', id: result.insertId });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el evento', error: err.message });
    }
});

// PUT: Actualizar evento
router.put('/api/eventos/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const evento = req.body;

    const error = validarEvento(evento);
    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const result = await actualizarEvento(id, evento);
        if (result.affectedRows > 0) {
            res.json({ message: 'Evento actualizado' });
        } else {
            res.status(404).json({ message: 'Evento no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el evento', error: err.message });
    }
});

// DELETE: Eliminar evento
router.delete('/api/eventos/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const result = await eliminarEvento(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Evento eliminado' });
        } else {
            res.status(404).json({ message: 'Evento no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el evento', error: err.message });
    }
});

export default router;

// Validación básica
const validarEvento = (evento: any): string | null => {
    if (!evento.nombre || typeof evento.nombre !== 'string') {
        return 'El nombre del evento es obligatorio y debe ser un texto';
    }
    if (!evento.fecha || isNaN(Date.parse(evento.fecha))) {
        return 'La fecha del evento es obligatoria y debe tener un formato válido';
    }
    if (!evento.juego || typeof evento.juego !== 'string') {
        return 'El juego del evento es obligatorio';
    }
    // precio_inscripcion opcional
    if (evento.precio_inscripcion !== undefined && isNaN(Number(evento.precio_inscripcion))) {
        return 'El precio de inscripción debe ser un número válido';
    }
    // aforo_maximo opcional
    if (evento.aforo_maximo !== undefined && !Number.isInteger(evento.aforo_maximo)) {
        return 'El aforo máximo debe ser un número entero';
    }
    return null;
};

