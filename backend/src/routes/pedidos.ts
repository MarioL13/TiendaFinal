import express from 'express';
import {
    actualizarEstadoPedido,
    confirmarCompra,
    obtenerDetallesPedido,
    obtenerPedidos,
    obtenerPedidosPorUsuario,
    obtenerUsuarioPedido
} from '../services/pedidosServices';
import { verificarAdmin, verificarToken } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @api {post} /api/pedidos/confirmar Confirmar una compra
 * @apiName ConfirmarCompra
 * @apiGroup Pedidos
 * @apiPermission usuario autenticado
 *
 * @apiParam {Number} id_usuario ID del usuario que realiza la compra.
 * @apiParam {String} tipoPago Método de pago utilizado.
 *
 * @apiSuccess (201) {Object} resultado Resultado de la confirmación de la compra.
 *
 * @apiError (400) {String} error Faltan parámetros requeridos.
 * @apiError (500) {String} error Error interno del servidor.
 */
router.post('/api/pedidos/confirmar', verificarToken, async (req, res) => {
    const { id_usuario, tipoPago } = req.body;

    if (!id_usuario || !tipoPago) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
    }

    try {
        const resultado = await confirmarCompra(id_usuario, tipoPago);
        res.status(201).json(resultado);
    } catch (error: any) {
        console.error('Error al confirmar pedido:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @api {get} /api/pedidos/mis_pedidos Obtener pedidos del usuario autenticado
 * @apiName ObtenerPedidosPorUsuario
 * @apiGroup Pedidos
 * @apiPermission usuario autenticado
 *
 * @apiParam (Query String) {Number} [page=1] Número de página para paginación.
 * @apiParam (Query String) {Number} [limit=10] Cantidad de pedidos por página.
 * @apiParam (Query String) {String} [estado] Filtrar por estado del pedido.
 * @apiParam (Query String) {String} [fecha_inicio] Filtrar pedidos desde esta fecha (YYYY-MM-DD).
 * @apiParam (Query String) {String} [fecha_fin] Filtrar pedidos hasta esta fecha (YYYY-MM-DD).
 *
 * @apiSuccess {Object[]} pedidos Lista de pedidos del usuario.
 * @apiError (500) {String} error Error interno del servidor.
 */
router.get('/api/pedidos/mis_pedidos', verificarToken, async (req, res) => {
    try {
        const usuarioLogeado = (req as any).usuario;
        const id_usuario = parseInt(usuarioLogeado.id, 10);

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
});

/**
 * @api {get} /api/pedidos/:id_pedido Obtener detalles de un pedido
 * @apiName ObtenerDetallesPedido
 * @apiGroup Pedidos
 * @apiPermission usuario autenticado (propietario del pedido o admin)
 *
 * @apiParam {Number} id_pedido ID del pedido.
 *
 * @apiSuccess {Object} detalles Detalles completos del pedido.
 *
 * @apiError (401) {String} error No autorizado para ver el pedido.
 * @apiError (500) {String} error Error interno del servidor.
 */
router.get('/api/pedidos/:id_pedido', verificarToken, async (req, res) => {
    const { id_pedido } = req.params;
    const usuarioLogeado = (req as any).usuario;
    const usuarioPedido = await obtenerUsuarioPedido(parseInt(id_pedido));

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

/**
 * @api {put} /api/pedidos/:id_pedido/estado Actualizar estado de un pedido
 * @apiName ActualizarEstadoPedido
 * @apiGroup Pedidos
 * @apiPermission administrador
 *
 * @apiParam {Number} id_pedido ID del pedido.
 * @apiParam {String} nuevoEstado Nuevo estado del pedido. Valores válidos: "Pendiente", "Pagado", "Entregado", "Cancelado".
 *
 * @apiSuccess {Object} resultado Resultado de la actualización.
 *
 * @apiError (400) {String} error Estado no válido.
 * @apiError (500) {String} error Error interno del servidor.
 */
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

/**
 * @api {get} /api/pedidos Obtener lista de pedidos (Admin)
 * @apiName ObtenerPedidos
 * @apiGroup Pedidos
 * @apiPermission administrador
 *
 * @apiParam (Query String) {Number} [page=1] Número de página.
 * @apiParam (Query String) {Number} [limit=10] Cantidad de pedidos por página.
 * @apiParam (Query String) {String} [estado] Filtrar por estado.
 * @apiParam (Query String) {String} [fecha_inicio] Filtrar pedidos desde esta fecha (YYYY-MM-DD).
 * @apiParam (Query String) {String} [fecha_fin] Filtrar pedidos hasta esta fecha (YYYY-MM-DD).
 *
 * @apiSuccess {Object[]} pedidos Lista paginada de pedidos.
 * @apiError (500) {String} error Error interno del servidor.
 */
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
