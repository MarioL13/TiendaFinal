import { Router, Request, Response } from 'express';
import {
    agregarAlCarrito,
    obtenerCarritoUsuario,
    actualizarCantidadCarrito,
    eliminarItemCarrito,
    vaciarCarrito
} from '../services/carritoServices';

const router = Router();

// Obtener el carrito de un usuario
router.get('/api/carrito/:id_usuario', async (req: Request, res: Response) => {
    const id_usuario = parseInt(req.params.id_usuario);
    try {
        const carrito = await obtenerCarritoUsuario(id_usuario);
        res.json(carrito);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el carrito', error: err.message });
    }
});

// Añadir al carrito
router.post('/api/carrito', async (req: Request, res: Response) => {
    const { id_usuario, tipo_item, id_item, cantidad } = req.body;
    try {
        const result = await agregarAlCarrito(id_usuario, tipo_item, id_item, cantidad);
        res.status(201).json({ message: 'Ítem añadido al carrito', id: result.insertId });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al añadir al carrito', error: err.message });
    }
});

// Actualizar cantidad de un ítem
router.put('/api/carrito/:id_carrito', async (req: Request, res: Response) => {
    const id_carrito = parseInt(req.params.id_carrito);
    const { cantidad } = req.body;
    try {
        const result = await actualizarCantidadCarrito(id_carrito, cantidad);
        if (result.affectedRows > 0) {
            res.json({ message: 'Cantidad actualizada' });
        } else {
            res.status(404).json({ message: 'Ítem no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar la cantidad', error: err.message });
    }
});

// Eliminar ítem del carrito
router.delete('/api/carrito/:id_carrito', async (req: Request, res: Response) => {
    const id_carrito = parseInt(req.params.id_carrito);
    try {
        const result = await eliminarItemCarrito(id_carrito);
        if (result.affectedRows > 0) {
            res.json({ message: 'Ítem eliminado del carrito' });
        } else {
            res.status(404).json({ message: 'Ítem no encontrado' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el ítem', error: err.message });
    }
});

// Vaciar carrito (opcional)
router.delete('/api/carrito/usuario/:id_usuario', async (req: Request, res: Response) => {
    const id_usuario = parseInt(req.params.id_usuario);
    try {
        await vaciarCarrito(id_usuario);
        res.json({ message: 'Carrito vaciado' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al vaciar el carrito', error: err.message });
    }
});

export default router;
