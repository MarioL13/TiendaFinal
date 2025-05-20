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
    return new Promise((resolve, reject) => {
        db.beginTransaction(async err => {
            if (err) return reject(err);

            if (!['tienda', 'online'].includes(tipoPago)) {
                return db.rollback(() => reject(new Error('Tipo de pago inválido.')));
            }

            try {
                const carrito = await obtenerCarritoCompletoUsuario(id_usuario);

                if (carrito.length === 0) {
                    return db.rollback(() => reject(new Error('El carrito está vacío.')));
                }

                const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

                db.query(
                    `INSERT INTO Pedidos (id_usuario, total, estado)
                     VALUES (?, ?, ?)`,
                    [id_usuario, total, tipoPago === 'tienda' ? 'Pendiente' : 'Pagado'],
                    (err, result) => {
                        if (err) return db.rollback(() => reject(err));

                        const id_pedido = (result as OkPacket).insertId;

                        const detallesQuery = `
                            INSERT INTO DetallePedido (id_pedido, tipo_item, id_item, cantidad, precio)
                            VALUES (?, ?, ?, ?, ?)
                        `;

                        const detallesPromises = carrito.map(item => {
                            return new Promise((res, rej) => {
                                db.query(
                                    detallesQuery,
                                    [id_pedido, item.tipo_item, item.id_item, item.cantidad, item.precio],
                                    (err) => {
                                        if (err) return rej(err);
                                        res(null);
                                    }
                                );
                            });
                        });

                        Promise.all(detallesPromises)
                            .then(async () => {
                                try {
                                    await vaciarCarrito(id_usuario);

                                    db.commit(err => {
                                        if (err) return db.rollback(() => reject(err));
                                        resolve({ success: true, mensaje: 'Pedido confirmado', id_pedido });
                                    });
                                } catch (err) {
                                    db.rollback(() => reject(err));
                                }
                            })
                            .catch(err => db.rollback(() => reject(err)));
                    }
                );
            } catch (err) {
                db.rollback(() => reject(err));
            }
        });
    });
};

export const obtenerPedidosPorUsuario = (id_usuario: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM Pedidos WHERE id_usuario = ? ORDER BY fecha_pedido DESC`,
            [id_usuario],
            (err, results) => {
                if (err) return reject(err);
                resolve(results as any);
            }
        );
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