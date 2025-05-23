import { Router, Request, Response } from 'express';
import {
    obtenerDeseados,
    agregarProducto,
    eliminarDeseado,
    existeDeseado
} from '../services/deseadosServices';

const router = Router();

router.get('/api/wishlist/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const deseados = await obtenerDeseados(id);
        if (deseados) {
            res.json(deseados);
        }else{
            res.status(404).json({message: 'No hay lista aun'});
        }
    }catch(err: any) {
        console.log(err);
        res.status(500).json({message: 'Error al obtener la lista', error: err.message })
    }
})

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
    try{
        const result = await agregarProducto(deseado);
        res.status(201).json({ message: 'Producto Agregado', id: result.insertId})
    }catch(err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error al agregar el producto', error: err.message })
    }
})

router.delete('/api/wishlist/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await eliminarDeseado(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Producto eliminado'});
        }else {
            res.status(404).json({message: 'Deseado no encontrado'});
        }
    }catch(err: any) {
        console.error(err);
        res.status(500).json({message: 'Error al eliminar el deseado', error: err.message})
    }
})

export default router;

