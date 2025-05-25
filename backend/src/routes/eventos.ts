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

/**
 * @api {get} /api/eventos Obtener todos los eventos
 * @apiName ObtenerEventos
 * @apiGroup Eventos
 *
 * @apiParam (Query) {String} [fecha] Filtro opcional por fecha del evento (formato ISO).
 * @apiParam (Query) {String} [juego] Filtro opcional por nombre del juego.
 * @apiParam (Query) {String} [nombre] Filtro opcional por nombre del evento.
 *
 * @apiSuccess {Object[]} eventos Lista de eventos que cumplen con los filtros.
 *
 * @apiError (500) InternalServerError Error al obtener los eventos.
 */
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

/**
 * @api {get} /api/eventos/:id Obtener evento por ID
 * @apiName ObtenerEventoPorId
 * @apiGroup Eventos
 *
 * @apiParam (URL) {Number} id ID único del evento.
 *
 * @apiSuccess {Object} evento Detalles del evento solicitado.
 *
 * @apiError (400) BadRequest ID inválido.
 * @apiError (404) NotFound Evento no encontrado.
 * @apiError (500) InternalServerError Error al obtener el evento.
 */
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

/**
 * @api {post} /api/eventos Crear un nuevo evento
 * @apiName CrearEvento
 * @apiGroup Eventos
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token JWT del usuario (Bearer).
 *
 * @apiBody {String} nombre Nombre del evento.
 * @apiBody {String} fecha Fecha del evento (formato ISO).
 * @apiBody {String} juego Juego asociado al evento.
 * @apiBody {Number} [precio_inscripcion] Precio de inscripción (opcional).
 * @apiBody {Number} [aforo_maximo] Aforo máximo permitido (opcional).
 *
 * @apiSuccess (201) {String} message Mensaje de confirmación.
 * @apiSuccess (201) {Number} id ID del evento creado.
 *
 * @apiError (400) BadRequest Datos inválidos o incompletos.
 * @apiError (401) Unauthorized Token inválido o no proporcionado.
 * @apiError (403) Forbidden El usuario no tiene permisos de administrador.
 * @apiError (500) InternalServerError Error al crear el evento.
 */
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

/**
 * @api {put} /api/eventos/:id Actualizar un evento
 * @apiName ActualizarEvento
 * @apiGroup Eventos
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token JWT del usuario (Bearer).
 *
 * @apiParam (URL) {Number} id ID del evento a actualizar.
 * @apiBody {String} nombre Nombre actualizado del evento.
 * @apiBody {String} fecha Fecha actualizada (formato ISO).
 * @apiBody {String} juego Juego actualizado.
 * @apiBody {Number} [precio_inscripcion] Precio de inscripción actualizado (opcional).
 * @apiBody {Number} [aforo_maximo] Aforo máximo actualizado (opcional).
 *
 * @apiSuccess {String} message Mensaje de confirmación.
 *
 * @apiError (400) BadRequest Datos inválidos.
 * @apiError (401) Unauthorized Token inválido o no proporcionado.
 * @apiError (403) Forbidden Sin permisos para modificar.
 * @apiError (404) NotFound Evento no encontrado.
 * @apiError (500) InternalServerError Error al actualizar el evento.
 */
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

/**
 * @api {delete} /api/eventos/:id Eliminar un evento
 * @apiName EliminarEvento
 * @apiGroup Eventos
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token JWT del usuario (Bearer).
 *
 * @apiParam (URL) {Number} id ID del evento a eliminar.
 *
 * @apiSuccess {String} message Mensaje de confirmación.
 *
 * @apiError (401) Unauthorized Token inválido o no proporcionado.
 * @apiError (403) Forbidden Sin permisos para eliminar.
 * @apiError (404) NotFound Evento no encontrado.
 * @apiError (500) InternalServerError Error al eliminar el evento.
 */
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

/**
 * Validación básica de los datos del evento
 * @param {any} evento Objeto evento con los datos a validar
 * @returns {string | null} Retorna mensaje de error o null si es válido
 */
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
