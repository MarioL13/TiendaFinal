import { Router, Request, Response } from 'express';
import {
    obtenerDeseados,
    agregarProducto,
    eliminarDeseado,
    existeDeseado
} from '../services/deseadosServices';

const router = Router();

/**
 * @api {get} /api/wishlist/:id Obtener lista de deseos de un usuario
 * @apiName ObtenerListaDeseos
 * @apiGroup Deseados
 *
 * @apiParam {Number} id ID del usuario
 *
 * @apiSuccess {Object[]} deseados Lista de productos y cartas deseados por el usuario
 *
 * @apiError 404 No hay lista de deseos para ese usuario
 * @apiError 500 Error interno al obtener la lista
 */
router.get('/api/wishlist/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const deseados = await obtenerDeseados(id);
        if (deseados) {
            res.json(deseados);
        } else {
            res.status(404).json({ message: 'No hay lista aun' });
        }
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: 'Error al obtener la lista', error: err.message });
    }
});

/**
 * @api {post} /api/wishlist Agregar producto o carta a la lista de deseos
 * @apiName AgregarDeseado
 * @apiGroup Deseados
 *
 * @apiBody {Number} id_usuario ID del usuario (obligatorio)
 * @apiBody {Number} [id_producto] ID del producto (opcional, o id_carta)
 * @apiBody {Number} [id_carta] ID de la carta (opcional, o id_producto)
 *
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Number} id ID del registro insertado
 *
 * @apiError 400 Parámetros incorrectos o faltantes
 * @apiError 409 Producto o carta ya existe en la lista de deseos
 * @apiError 500 Error interno al agregar producto
 */
router.post('/api/wishlist', async (req: Request, res: Response) => {
    const deseado = req.body;

    if (!deseado.id_usuario || typeof deseado.id_usuario !== 'number') {
        return res.status(400).json({ message: 'El id_usuario es obligatorio y debe ser un número.' });
    }

    if ((deseado.id_producto && typeof deseado.id_producto !== 'number') ||
        (deseado.id_carta && typeof deseado.id_carta !== 'number')) {
        return res.status(400).json({ message: 'id_producto o id_carta deben ser números.' });
    }

    const yaExiste = await existeDeseado(deseado.id_usuario, deseado.id_producto, deseado.id_carta);
    if (yaExiste) {
        return res.status(409).json({ message: 'Este producto ya está en la lista de deseos.' });
    }

    if ((!deseado.id_producto && !deseado.id_carta) || (deseado.id_producto && deseado.id_carta)) {
        return res.status(400).json({ message: 'Debes enviar solo id_producto o id_carta, no ambos ni ninguno.' });
    }
    try {
        const result = await agregarProducto(deseado);
        res.status(201).json({ message: 'Producto Agregado', id: result.insertId });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al agregar el producto', error: err.message });
    }
});

/**
 * @api {delete} /api/wishlist/:id Eliminar producto o carta de la lista de deseos
 * @apiName EliminarDeseado
 * @apiGroup Deseados
 *
 * @apiParam {Number} id ID del elemento en la lista de deseos
 *
 * @apiSuccess {String} message Mensaje de confirmación
 *
 * @apiError 404 No se encontró el deseado con ese ID
 * @apiError 500 Error interno al eliminar
 */
router.delete('/api/wishlist/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await eliminarDeseado(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ message: 'Deseado no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el deseado', error: err.message });
    }
});

export default router;
