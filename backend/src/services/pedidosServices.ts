import db from './db';
import { obtenerCarritoCompletoUsuario, vaciarCarrito } from './carritoServices';
import { QueryError, OkPacket, RowDataPacket } from 'mysql2';

interface FiltroPedidos {
    page: number;
    limit: number;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}

export const confirmarCompra = (
    id_usuario: number,
    tipoPago: 'tienda' | 'online'
): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        db.beginTransaction(async err => {
            if (err) return reject(err);

            try {
                const carrito = await obtenerCarritoCompletoUsuario(id_usuario);
                if (carrito.length === 0) {
                    return db.rollback(() => reject(new Error('El carrito está vacío.')));
                }

                // 1) Validamos y preparamos updates de stock
                for (const item of carrito) {
                    const tabla = item.tipo_item === 'producto' ? 'Productos' : 'cartas';
                    const idCol  = item.tipo_item === 'producto' ? 'id_producto' : 'id_carta';

                    // Obtenemos stock actual
                    const [[{ stock }]] = await db
                        .promise()
                        .query<(RowDataPacket & { stock: number })[]>(
                            `SELECT stock FROM ${tabla} WHERE ${idCol} = ? FOR UPDATE`,
                            [item.id_item]
                        );

                    if (stock < item.cantidad) {
                        throw new Error(
                            `Sin stock suficiente de ${item.tipo_item} ${item.id_item}`
                        );
                    }
                }

                // 2) Insertamos cabecera de pedido
                const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
                const estado = tipoPago === 'tienda' ? 'Pendiente' : 'Pagado';
                const [{ insertId: id_pedido }] = await db
                    .promise()
                    .query<OkPacket>(
                        `INSERT INTO Pedidos (id_usuario, total, estado) VALUES (?, ?, ?)`,
                        [id_usuario, total, estado]
                    );

                // 3) Insertamos detalles y actualizamos stock
                for (const item of carrito) {
                    await db
                        .promise()
                        .query<OkPacket>(
                            `INSERT INTO DetallePedido (id_pedido, tipo_item, id_item, cantidad, precio)
               VALUES (?, ?, ?, ?, ?)`,
                            [
                                id_pedido,
                                item.tipo_item,
                                item.id_item,
                                item.cantidad,
                                item.precio,
                            ]
                        );

                    const tabla = item.tipo_item === 'producto' ? 'Productos' : 'cartas';
                    const idCol  = item.tipo_item === 'producto' ? 'id_producto' : 'id_carta';

                    await db
                        .promise()
                        .query<OkPacket>(
                            `UPDATE ${tabla}
               SET stock = stock - ?
               WHERE ${idCol} = ?`,
                            [item.cantidad, item.id_item]
                        );
                }

                // 4) Vaciamos carrito y confirmamos
                await vaciarCarrito(id_usuario);
                db.commit(err => {
                    if (err) return db.rollback(() => reject(err));
                    resolve({ success: true, mensaje: 'Pedido confirmado', id_pedido });
                });

            } catch (error: any) {
                return db.rollback(() => reject(error));
            }
        });
    });
};

export const obtenerPedidosPorUsuario = (id_usuario: number, { page, limit, estado, fecha_inicio, fecha_fin }: FiltroPedidos): Promise<{ pedidos: any[]; total: number; page: number; totalPages: number; }> => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;
        const condiciones: string[] = [`id_usuario = ?`];
        const params: any[] = [id_usuario];

        if (estado) {
            condiciones.push(`estado = ?`);
            params.push(estado);
        }
        if (fecha_inicio) {
            condiciones.push(`fecha_pedido >= ?`);
            params.push(fecha_inicio);
        }
        if (fecha_fin) {
            condiciones.push(`fecha_pedido <= ?`);
            params.push(fecha_fin + ' 23:59:59');
        }

        const whereClause = condiciones.length > 0
            ? `WHERE ${condiciones.join(' AND ')}`
            : '';

        const sql = `
      SELECT SQL_CALC_FOUND_ROWS *
      FROM Pedidos
      ${whereClause}
      ORDER BY fecha_pedido DESC
      LIMIT ? OFFSET ?
    `;

        db.query(sql, [...params, limit, offset], (err, resultados) => {
            if (err) return reject(err);

            // Obtenemos el total sin limit
            db.query(`SELECT FOUND_ROWS() as total`, (err, totalRows: any[]) => {
                if (err) return reject(err);
                const total = totalRows[0].total as number;
                const totalPages = Math.ceil(total / limit);
                resolve({ pedidos: resultados as any, total, page, totalPages });
            });
        });
    });
};

export const obtenerDetallesPedido = (id_pedido: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT d.*, 
                    CASE d.tipo_item
                        WHEN 'producto' THEN p.nombre
                        WHEN 'carta' THEN c.nombre
                    END AS nombre_item
             FROM DetallePedido d
             LEFT JOIN productos p ON d.tipo_item = 'producto' AND d.id_item = p.id_producto
             LEFT JOIN cartas c ON d.tipo_item = 'carta' AND d.id_item = c.id_carta
             WHERE d.id_pedido = ?`,
            [id_pedido],
            (err, results) => {
                if (err) return reject(err);
                resolve(results as any);
            }
        );
    });
};

export const actualizarEstadoPedido = (id_pedido: number, nuevoEstado: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE Pedidos SET estado = ? WHERE id_pedido = ?`,
            [nuevoEstado, id_pedido],
            (err, result) => {
                if (err) return reject(err);
                resolve({ success: true, mensaje: 'Estado actualizado correctamente' });
            }
        );
    });
};

export const obtenerPedidos = ({ page, limit, estado, fecha_inicio, fecha_fin}: FiltroPedidos): Promise<any> => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;
        let condiciones: string[] = [];
        let params: any[] = [];

        if (estado) {
            condiciones.push(`estado = ?`);
            params.push(estado);
        }

        if (fecha_inicio) {
            condiciones.push(`fecha_pedido >= ?`);
            params.push(fecha_inicio);
        }

        if (fecha_fin) {
            condiciones.push(`fecha_pedido <= ?`);
            params.push(fecha_fin + ' 23:59:59'); // Final del día
        }

        const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

        const sql = `
            SELECT SQL_CALC_FOUND_ROWS *
            FROM Pedidos
            ${whereClause}
            ORDER BY fecha_pedido DESC
            LIMIT ? OFFSET ?
        `;

        db.query(sql, [...params, limit, offset], (err, resultados) => {
            if (err) return reject(err);

            db.query(`SELECT FOUND_ROWS() as total`, async (err, totalRows) => {
                if (err) return reject(err);
                const [rows] = await db
                    .promise()
                    .query<RowDataPacket[]>('SELECT COUNT(*) as total FROM Pedidos');

                const total = (rows[0] as { total: number }).total;
                const totalPages = Math.ceil(total / limit);

                resolve({
                    pedidos: resultados,
                    total,
                    page,
                    totalPages
                });
            });
        });
    });
};

export const obtenerUsuarioPedido = async (id_pedido: number): Promise<number> => {
    const [rows] = await db.promise().query<(RowDataPacket & { id_usuario: number })[]>(
        'SELECT id_usuario FROM Pedidos WHERE id_pedido = ?',
        [id_pedido]
    );

    if (rows.length === 0) {
        throw new Error('Pedido no encontrado');
    }

    return rows[0].id_usuario
};