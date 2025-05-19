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
    existeItem
} from '../services/carritoServices';

const router = Router();

// Obtener el carrito del usuario logueado
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

// Añadir al carrito del usuario logueado
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

// Actualizar cantidad de un ítem (verifica propietario más adelante si es necesario)
router.put('/api/carrito/:id_carrito', verificarToken, async (req: Request, res: Response) => {
    const { cantidad } = req.body;
    const id_carrito = parseInt(req.params.id_carrito);

    try {
        const result = await actualizarCantidadCarrito(id_carrito, cantidad);
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

// Eliminar ítem del carrito
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

// Vaciar carrito del usuario logueado
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

export default router;
