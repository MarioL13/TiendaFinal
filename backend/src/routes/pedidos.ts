import express from 'express';
import { confirmarCompra } from '../services/pedidosServices';

const router = express.Router();

// POST /api/pedidos/confirmar
router.post('/confirmar', async (req, res) => {
    const { id_usuario, tipoPago } = req.body;

    if (!id_usuario || !tipoPago) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
    }

    try {
        const resultado = await confirmarCompra(id_usuario, tipoPago);
        res.status(201).json(resultado); // 201: Created
    } catch (error: any) {
        console.error('Error al confirmar pedido:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
