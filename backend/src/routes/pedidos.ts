import express from 'express';
import {
    actualizarEstadoPedido,
    confirmarCompra,
    obtenerDetallesPedido,
    obtenerPedidos,
    obtenerPedidosPorUsuario,
    obtenerUsuarioPedido
} from '../services/pedidosServices';
import {verificarAdmin, verificarToken} from "../middlewares/authMiddleware";

const router = express.Router();

// POST /api/pedidos/confirmar
router.post('/api/pedidos/confirmar', verificarToken, async (req, res) => {
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

// GET /api/pedidos/usuario/:id_usuario
router.get('/api/pedidos/mis_pedidos', verificarToken, async (req, res) => {
        try {
            const usuarioLogeado = (req as any).usuario;
            const id_usuario = parseInt(usuarioLogeado.id, 10);

            // Leemos los filtros/paginación de la query
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const estado = req.query.estado as string | undefined;
            const fecha_inicio = req.query.fecha_inicio as string | undefined;
            const fecha_fin = req.query.fecha_fin as string | undefined;

            const resultado = await obtenerPedidosPorUsuario(id_usuario, {
                page,
                limit,
                estado,
                fecha_inicio,
                fecha_fin,
            });

            res.status(200).json(resultado);
        } catch (error: any) {
            console.error('Error al obtener mis pedidos:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

router.get('/api/pedidos/:id_pedido', verificarToken, async (req, res) => {
    const { id_pedido } = req.params;
    const usuarioLogeado = (req as any).usuario;
    const usuarioPedido = await obtenerUsuarioPedido(parseInt(id_pedido))

    if (usuarioLogeado.id !== usuarioPedido && usuarioLogeado.rol !== "Admin") {
        return res.status(401).json({ error: 'No puedes accedere a pedidos ajenos.' });
    }

    try {
        const detalles = await obtenerDetallesPedido(parseInt(id_pedido));
        res.status(200).json(detalles);
    } catch (error: any) {
        console.error('Error al obtener detalles del pedido:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/pedidos/:id_pedido/estado
router.put('/api/pedidos/:id_pedido/estado', verificarToken, verificarAdmin, async (req, res) => {
    const { id_pedido } = req.params;
    const { nuevoEstado } = req.body;

    const estadosValidos = ['Pendiente', 'Pagado', 'Entregado', 'Cancelado'];
    if (!estadosValidos.includes(nuevoEstado)) {
        return res.status(400).json({ error: 'Estado no válido.' });
    }

    try {
        const resultado = await actualizarEstadoPedido(parseInt(id_pedido), nuevoEstado);
        res.status(200).json(resultado);
    } catch (error: any) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/pedidos', verificarToken, verificarAdmin, async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const estado = req.query.estado as string | undefined;
    const fecha_inicio = req.query.fecha_inicio as string | undefined;
    const fecha_fin = req.query.fecha_fin as string | undefined;

    try {
        const resultado = await obtenerPedidos({ page, limit, estado, fecha_inicio, fecha_fin });
        res.json(resultado);
    } catch (error: any) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
