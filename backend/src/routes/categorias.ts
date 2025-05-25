import { Router, Request, Response } from 'express';
import {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} from '../services/categoriasServices';
import { verificarAdmin, verificarToken } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @api {get} /api/categorias Obtener todas las categorías
 * @apiName ObtenerCategorias
 * @apiGroup Categorias
 *
 * @apiSuccess {Object[]} categorias Lista de categorías.
 *
 * @apiError (500) InternalServerError Error al obtener las categorías.
 */
router.get('/api/categorias', async (req: Request, res: Response) => {
    try {
        const categorias = await obtenerCategorias();
        res.json(categorias);
    } catch (err: any) {
        console.error('Error al obtener las categorías:', err);
        res.status(500).json({ message: 'Error al obtener las categorías', error: err.message });
    }
});

/**
 * @api {get} /api/categorias/:id Obtener categoría por ID
 * @apiName ObtenerCategoriaPorId
 * @apiGroup Categorias
 *
 * @apiParam {Number} id ID único de la categoría.
 *
 * @apiSuccess {Object} categoria Datos de la categoría.
 *
 * @apiError (404) NotFound Categoría no encontrada.
 * @apiError (500) InternalServerError Error al obtener la categoría.
 */
router.get('/api/categorias/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const categoria = await obtenerCategoriaPorId(id);
        if (categoria) {
            res.json(categoria);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (err: any) {
        console.error(`Error al obtener la categoría con ID ${id}:`, err);
        res.status(500).json({ message: 'Error al obtener la categoría', error: err.message });
    }
});

/**
 * @api {post} /api/categorias Crear nueva categoría
 * @apiName CrearCategoria
 * @apiGroup Categorias
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiParam {String} nombre Nombre de la categoría.
 *
 * @apiSuccess (201) {Object} categoria Categoría creada con ID.
 *
 * @apiError (400) BadRequest Nombre de categoría inválido.
 * @apiError (401) Unauthorized Token inválido o no enviado.
 * @apiError (403) Forbidden Usuario no autorizado.
 * @apiError (500) InternalServerError Error al crear la categoría.
 */
router.post('/api/categorias', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const categoria = req.body;

    if (!categoria.nombre || typeof categoria.nombre !== 'string') {
        return res.status(400).json({ message: 'Nombre de categoría inválido' });
    }

    try {
        const result = await crearCategoria(categoria);
        res.status(201).json({
            message: 'Categoría creada',
            categoria: { id: result.insertId, ...categoria }
        });
    } catch (err: any) {
        console.error('Error al crear la categoría:', err);
        res.status(500).json({ message: 'Error al crear la categoría', error: err.message });
    }
});

/**
 * @api {put} /api/categorias/:id Actualizar categoría por ID
 * @apiName ActualizarCategoria
 * @apiGroup Categorias
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiParam {Number} id ID único de la categoría.
 * @apiParam {String} nombre Nombre actualizado de la categoría.
 *
 * @apiSuccess {String} message Confirmación de actualización.
 *
 * @apiError (400) BadRequest Nombre de categoría inválido.
 * @apiError (401) Unauthorized Token inválido o no enviado.
 * @apiError (403) Forbidden Usuario no autorizado.
 * @apiError (404) NotFound Categoría no encontrada.
 * @apiError (500) InternalServerError Error al actualizar la categoría.
 */
router.put('/api/categorias/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = req.body;

    if (!categoria.nombre || typeof categoria.nombre !== 'string') {
        return res.status(400).json({ message: 'Nombre de categoría inválido' });
    }

    try {
        const result = await actualizarCategoria(id, categoria);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Categoría actualizada' });
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (err: any) {
        console.error(`Error al actualizar la categoría con ID ${id}:`, err);
        res.status(500).json({ message: 'Error al actualizar la categoría', error: err.message });
    }
});

/**
 * @api {delete} /api/categorias/:id Eliminar categoría por ID
 * @apiName EliminarCategoria
 * @apiGroup Categorias
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiParam {Number} id ID único de la categoría.
 *
 * @apiSuccess {String} message Confirmación de eliminación.
 *
 * @apiError (401) Unauthorized Token inválido o no enviado.
 * @apiError (403) Forbidden Usuario no autorizado.
 * @apiError (404) NotFound Categoría no encontrada.
 * @apiError (500) InternalServerError Error al eliminar la categoría.
 */
router.delete('/api/categorias/:id', verificarToken, verificarAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await eliminarCategoria(id);
        if (result.affectedRows > 0) {
            res.json({ message: 'Categoría eliminada' });
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (err: any) {
        console.error(`Error al eliminar la categoría con ID ${id}:`, err);
        res.status(500).json({ message: 'Error al eliminar la categoría', error: err.message });
    }
});

export default router;
