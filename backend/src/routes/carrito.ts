import { Router, Request, Response } from 'express';
import {
    verificarToken,
} from '../middlewares/authMiddleware';
import {
    agregarAlCarrito,
    obtenerCarritoCompletoUsuario,
    actualizarCantidadCarrito,
    eliminarItemCarritoSeguro,
    vaciarCarrito,
    existeItem,
    obtenerTotalItemsCarrito
} from '../services/carritoServices';

const router = Router();

/**
 * @api {get} /api/carrito Obtener carrito completo del usuario logueado
 * @apiName ObtenerCarrito
 * @apiGroup Carrito
 *
 * @apiHeader {String} Authorization Token JWT del usuario.
 *
 * @apiSuccess {Object[]} carrito Lista de items en el carrito con detalles.
 *
 * @apiError (500) InternalServerError Error al obtener el carrito.
 */
router.get('/api/carrito', verificarToken, async (req: Request, res: Response) => {
    const usuarioLogeado = (req as any).usuario;
    const id_usuario = usuarioLogeado.id;

    try {
        const carrito = await obtenerCarritoCompletoUsuario(id_usuario);
        res.json(carrito);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el carrito', error: err.message });
    }
});

/**
 * @api {post} /api/carrito Añadir un ítem al carrito del usuario logueado
 * @apiName AgregarAlCarrito
 * @apiGroup Carrito
 *
 * @apiHeader {String} Authorization Token JWT del usuario.
 * @apiParam {String} tipo_item Tipo de ítem (ej. producto, servicio).
 * @apiParam {Number} id_item ID del ítem a agregar.
 * @apiParam {Number} cantidad Cantidad a añadir (debe ser mayor que 0).
 *
 * @apiSuccess (201) {String} message Confirmación de añadido.
 *
 * @apiError (400) {String} message Error de datos (ítem no encontrado o cantidad inválida).
 * @apiError (500) {String} message Error interno al añadir el ítem.
 */
router.post('/api/carrito', verificarToken, async (req: Request, res: Response) => {
    const usuarioLogeado = (req as any).usuario;
    const id_usuario = usuarioLogeado.id;
    const { tipo_item, id_item, cantidad } = req.body;

    try {
        const existe = await existeItem(tipo_item, id_item);
        if (!existe) {
            return res.status(400).json({ message: `${tipo_item} no encontrado` });
        }

        if (cantidad <= 0) {
            return res.status(400).json({ message: 'Cantidad inválida' });
        }

        const result = await agregarAlCarrito(id_usuario, tipo_item, id_item, cantidad);
        res.status(201).json({ message: 'Ítem añadido en el carrito' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al añadir al carrito', error: err.message });
    }
});

/**
 * @api {put} /api/carrito/:id_carrito Actualizar cantidad de un ítem del carrito
 * @apiName ActualizarCantidadCarrito
 * @apiGroup Carrito
 *
 * @apiHeader {String} Authorization Token JWT del usuario.
 * @apiParam {Number} id_carrito ID del ítem en el carrito a actualizar.
 * @apiParam {Number} cantidad Nueva cantidad (debe ser mayor que 0).
 *
 * @apiSuccess {String} message Confirmación de actualización.
 *
 * @apiError (400) {String} message Cantidad inválida.
 * @apiError (404) {String} message Ítem no encontrado o no pertenece al usuario.
 * @apiError (500) {String} message Error interno al actualizar.
 */
router.put('/api/carrito/:id_carrito', verificarToken, async (req: Request, res: Response) => {
    const { cantidad } = req.body;
    const id_carrito = parseInt(req.params.id_carrito);
    const id_usuario = (req as any).usuario.id;

    if (cantidad <= 0) {
        return res.status(400).json({ message: 'Cantidad inválida' });
    }

    try {
        const result = await actualizarCantidadCarrito(id_usuario, id_carrito, cantidad);
        if (result.affectedRows > 0) {
            res.json({ message: 'Cantidad actualizada' });
        } else {
            res.status(404).json({ message: 'Ítem no encontrado o no pertenece al usuario' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar la cantidad', error: err.message });
    }
});

/**
 * @api {delete} /api/carrito/item Eliminar un ítem del carrito
 * @apiName EliminarItemCarrito
 * @apiGroup Carrito
 *
 * @apiHeader {String} Authorization Token JWT del usuario.
 * @apiParam {String} tipo_item Tipo de ítem a eliminar.
 * @apiParam {Number} id_item ID del ítem a eliminar.
 *
 * @apiSuccess {String} message Confirmación de eliminación.
 *
 * @apiError (400) {String} message Faltan datos requeridos.
 * @apiError (404) {String} message Ítem no encontrado en el carrito.
 * @apiError (500) {String} message Error interno al eliminar el ítem.
 */
router.delete('/api/carrito/item', verificarToken, async (req, res) => {
    const { tipo_item, id_item } = req.body;
    const id_usuario = (req as any).usuario.id;

    if (!tipo_item || !id_item) {
        return res.status(400).json({ message: 'Faltan datos: tipo_item o id_item' });
    }

    try {
        const result = await eliminarItemCarritoSeguro(id_usuario, tipo_item, id_item);
        if (result.affectedRows > 0) {
            res.json({ message: 'Ítem eliminado del carrito' });
        } else {
            res.status(404).json({ message: 'Ítem no encontrado en tu carrito' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el ítem', error: err.message });
    }
});

/**
 * @api {delete} /api/carrito/todo Vaciar el carrito completo del usuario logueado
 * @apiName VaciarCarrito
 * @apiGroup Carrito
 *
 * @apiHeader {String} Authorization Token JWT del usuario.
 *
 * @apiSuccess {String} message Confirmación de vaciado.
 *
 * @apiError (500) {String} message Error interno al vaciar el carrito.
 */
router.delete('/api/carrito/todo', verificarToken, async (req, res) => {
    const usuarioLogeado = (req as any).usuario;
    const id_usuario = usuarioLogeado.id;

    try {
        await vaciarCarrito(id_usuario);
        res.json({ message: 'Carrito vaciado' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al vaciar el carrito', error: err.message });
    }
});

/**
 * @api {get} /api/carrito/total Obtener el total de ítems en el carrito del usuario logueado
 * @apiName ObtenerTotalItemsCarrito
 * @apiGroup Carrito
 *
 * @apiHeader {String} Authorization Token JWT del usuario.
 *
 * @apiSuccess {Number} totalItems Número total de ítems en el carrito.
 *
 * @apiError (500) {String} message Error interno al obtener el total.
 */
router.get('/api/carrito/total', verificarToken, async (req: Request, res: Response) => {
    const usuarioLogeado = (req as any).usuario;
    const id_usuario = usuarioLogeado.id;

    try {
        const total = await obtenerTotalItemsCarrito(id_usuario);
        res.json({ totalItems: total });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el total del carrito', error: err.message });
    }
});

export default router;
