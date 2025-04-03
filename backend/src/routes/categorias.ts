import { Router, Request, Response } from 'express';
import {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} from '../services/categoriasServices';

const router = Router();

// Obtener todas las categorías
router.get('/api/categorias', async (req: Request, res: Response) => {
    try {
        const categorias = await obtenerCategorias();
        res.json(categorias);
    } catch (err: any) {
        console.error('Error al obtener las categorías:', err);
        res.status(500).json({ message: 'Error al obtener las categorías', error: err.message });
    }
});

// Obtener una categoría por ID
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

// Crear una nueva categoría
router.post('/api/categorias', async (req: Request, res: Response) => {
    const categoria = req.body;
    try {
        const result = await crearCategoria(categoria);
        res.status(201).json({ message: 'Categoría creada', id: result.insertId });
    } catch (err: any) {
        console.error('Error al crear la categoría:', err);
        res.status(500).json({ message: 'Error al crear la categoría', error: err.message });
    }
});

// Actualizar una categoría
router.put('/api/categorias/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = req.body;
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

// Eliminar una categoría
router.delete('/api/categorias/:id', async (req: Request, res: Response) => {
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
